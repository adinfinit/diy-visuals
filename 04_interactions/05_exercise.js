"use strict";

/* 
Continue your house drawing exercise.

Here are a few ideas on what to do:

- animate a smoking chimney using particles
- if your house doesn't have a chimney, show it burning instead

The basic idea for simulating particles is having few
properties:

  speed
  position

It's usually more interesting to set them to some random
value.

// we add together multiple forces acting on the particle
force.x = 0.1 // wind
force.y = -5  // e.g. gravity

// calculate the acceleration
acceleration.x = force.x * deltaTime / mass
acceleration.y = force.y * deltaTime / mass

// note, it's possible to skip force calculations and mass
// for simplicity and setting them to some constant

// calculate the new speed value
speed.x = speed.x + acceleration.x * deltaTime
speed.y = speed.y + acceleration.y * deltaTime

// apply dampening to the particle, this is to prevent particles
// becoming too fast
speed.x = speed.x * 0.95
speed.y = speed.y * 0.95

// finally update the position
position.x = speed.x * deltaTime
position.y = speed.y * deltaTime


// additionally whenever the particle leaves the screen you
// can reset it to the starting position and starting speed
// values

*/
