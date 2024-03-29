package main

import (
	"bytes"
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/loov/watchrun/watch"
	"github.com/loov/watchrun/watchjs"
	"github.com/pkg/browser"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

var (
	addr     = flag.String("listen", "127.0.0.1:8080", "port to listen to")
	dir      = flag.String("dir", ".", "directory to monitor")
	debug    = flag.Bool("debug", false, "don't auto open browser")
	interval = flag.Duration("i", 300*time.Millisecond, "poll interval")

	watchServer *watchjs.Server
)

func main() {
	flag.Parse()

	if !filepath.IsAbs(*dir) {
		absdir, err := filepath.Abs(*dir)
		if err == nil {
			*dir = absdir
		}
	}

	if !*debug {
		go func() {
			time.Sleep(time.Second)
			browser.OpenURL("http://" + *addr)
		}()
	}

	watchServer = watchjs.NewServer(watchjs.Config{
		Interval: *interval,
		Monitor:  []string{filepath.Join(*dir, "**")},
		Ignore:   watchjs.DefaultIgnore,
		Care:     []string{"*.html", "*.css", "*.js", "*.ts"},
		OnChange: func(change watch.Change) (string, watchjs.Action) {
			// When change is in staticDir, we instruct the browser live (re)inject the file.
			if url, ok := watchjs.FileToURL(change.Path, *dir, "/"); ok {
				if filepath.Ext(change.Path) == ".css" {
					return url, watchjs.LiveInject
				}
				return url, watchjs.ReloadBrowser
			}
			return "/" + filepath.ToSlash(change.Path), watchjs.ReloadBrowser
		},
	})

	fmt.Println("Server starting on:", *addr)
	fmt.Println()
	fmt.Println("If browser does not open automatically,")
	fmt.Println("Please open http://" + *addr)
	fmt.Println()
	fmt.Println("Watching folder:", *dir)
	log.Fatal(http.ListenAndServe(*addr, http.HandlerFunc(serve)))
}

func serve(w http.ResponseWriter, r *http.Request) {
	watchjs.DisableCache(w)

	switch r.URL.Path {
	case "/":
		serveProjects(w, r)
	case "/~watch.js":
		watchServer.ServeHTTP(w, r)
	default:
		if strings.HasSuffix(r.URL.Path, "~") {
			serveProject(w, r)
			return
		}
		serveFile(w, r)
	}
}

func serveFile(w http.ResponseWriter, r *http.Request) {
	if path.Ext(r.URL.Path) == ".ts" {
		path := filepath.FromSlash(path.Join(*dir, r.URL.Path))
		data, err := os.ReadFile(path)
		if err != nil {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}

		result := esbuild.Transform(string(data), esbuild.TransformOptions{
			Loader: esbuild.LoaderTS,
			Target: esbuild.ES2018,
		})

		var buf bytes.Buffer
		for _, v := range result.Errors {
			fmt.Fprintln(&buf, v.Text)
		}
		if buf.Len() > 0 {
			http.Error(w, buf.String(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/javascript; charset=utf-8")
		http.ServeContent(w, r, r.URL.Path, time.Now(), bytes.NewReader(result.Code))
		return
	}
	path := filepath.FromSlash(path.Join(*dir, r.URL.Path))
	http.ServeFile(w, r, path)
}

func serveProject(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	path = strings.TrimSuffix(path, "~")

	t, err := template.ParseFiles("project.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	t.Execute(w, map[string]interface{}{
		"File": path,
	})
}

func serveProjects(w http.ResponseWriter, r *http.Request) {
	root := *dir

	folderInfos, err := os.ReadDir(root)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var folders []*Folder
	for _, folderInfo := range folderInfos {
		if !folderInfo.IsDir() ||
			strings.HasPrefix(folderInfo.Name(), ".") ||
			strings.HasPrefix(folderInfo.Name(), "_") {
			continue
		}
		folder := &Folder{}
		folders = append(folders, folder)
		folder.Title = folderInfo.Name()

		foldername := filepath.Join(root, folderInfo.Name())
		fileinfos, err := os.ReadDir(foldername)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		for _, fileinfo := range fileinfos {
			if strings.HasPrefix(fileinfo.Name(), ".") ||
				strings.HasPrefix(fileinfo.Name(), "_") {
				continue
			}
			filename := fileinfo.Name()

			if fileinfo.IsDir() {
				if _, err := os.Stat(filepath.Join(foldername, filename, "index.html")); err == nil {
					folder.Files = append(folder.Files, &File{
						Title: filename,
						URL:   path.Join(folderInfo.Name(), filename),
					})
				}
				continue
			}

			if strings.EqualFold(filepath.Ext(filename), ".html") {
				folder.Files = append(folder.Files, &File{
					Title: filename,
					URL:   path.Join(folderInfo.Name(), filename),
				})
				continue
			}

			file := &File{}
			folder.Files = append(folder.Files, file)
			file.Title = filename
			file.URL = path.Join(folderInfo.Name(), filename+"~")
		}

		sort.Slice(folder.Files, func(i, k int) bool {
			return folder.Files[i].Title < folder.Files[k].Title
		})
	}
	sort.Slice(folders, func(i, k int) bool {
		return folders[i].Title < folders[k].Title
	})

	t, err := template.ParseFiles("projects.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	t.Execute(w, map[string]interface{}{
		"Folders": folders,
	})
}

type Folder struct {
	Title string
	Files []*File
}

type File struct {
	URL   string
	Title string
}
