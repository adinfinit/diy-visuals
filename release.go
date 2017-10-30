// +build ignore

package main

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"strings"
)

type Bundle struct {
	Prefix string
	Zip    *zip.Writer
	Errs   []error

	buffer bytes.Buffer
}

func NewBundle(prefix string) *Bundle {
	bundle := &Bundle{}
	bundle.Prefix = prefix
	bundle.Zip = zip.NewWriter(&bundle.buffer)
	return bundle
}

func (bundle *Bundle) ok(err error) bool {
	if err != nil {
		bundle.Errs = append(bundle.Errs, err)
		return false
	}
	return true
}

func (bundle *Bundle) SaveTo(name string) error {
	err := bundle.Zip.Close()
	bundle.ok(err)
	return ioutil.WriteFile(name, bundle.buffer.Bytes(), 0755)
}

func (bundle *Bundle) File(name string) {
	bundle.FileAs(name, name)
}

func (bundle *Bundle) FileAs(name, target string) {
	target = path.Join(bundle.Prefix, target)
	fmt.Printf("\t+ %-50s -> %-50s\n", name, target)

	file, err := os.Open(filepath.FromSlash(name))
	if !bundle.ok(err) {
		return
	}
	defer file.Close()

	w, err := bundle.Zip.Create(target)
	if !bundle.ok(err) {
		return
	}

	_, err = io.Copy(w, file)
	bundle.ok(err)
}

func (bundle *Bundle) Glob(glob string) {
	matches, err := filepath.Glob(filepath.FromSlash(glob))
	if !bundle.ok(err) {
		return
	}

	for _, match := range matches {
		bundle.File(filepath.ToSlash(match))
	}
}

func (bundle *Bundle) Dir(dir string) {
	bundle.ok(filepath.Walk(filepath.FromSlash(dir),
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				return nil
			}

			bundle.File(filepath.ToSlash(path))
			return nil
		}))
}

func Build(goos, goarch string) {
	fmt.Println("==== BUNDLING ==== " + goos + " " + goarch)
	bundle := NewBundle("diy-visuals")

	tempbin := ".release/.bin/diy-visuals." + goos + "." + goarch
	bin := "diy-visuals"
	if goos == "windows" {
		tempbin += ".exe"
		bin += ".exe"
	}

	cmd := exec.Command("go", "build",
		"-o", tempbin,
		".",
	)
	cmd.Env = append([]string{
		"GOOS=" + goos,
		"GOARCH=" + goarch,
		"CGO_ENABLED=0",
	}, os.Environ()...)

	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(string(output))
		os.Exit(1)
	}

	bundle.FileAs(tempbin, bin)

	matches, err := ioutil.ReadDir(".")
	if err != nil {
		log.Fatal(err)
	}

	for _, match := range matches {
		if strings.HasPrefix(match.Name(), ".") {
			continue
		}
		if strings.HasSuffix(match.Name(), ".") {
			continue
		}

		if match.IsDir() {
			bundle.Dir(match.Name())
		} else {
			bundle.File(match.Name())
		}
	}

	os.MkdirAll(".release", 0755)
	err = bundle.SaveTo(".release/diy-visuals." + goos + "_" + goarch + ".zip")
	if len(bundle.Errs) > 0 {
		fmt.Println(bundle.Errs)
	}
	if err != nil {
		fmt.Println(err)
	}
}

func main() {
	for _, goos := range []string{"windows", "linux", "darwin"} {
		for _, goarch := range []string{"386", "amd64"} {
			Build(goos, goarch)
		}
	}
}
