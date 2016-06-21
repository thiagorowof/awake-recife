/**
 * Copyright 2011 Paul Lewis. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Fireworks = (function() {

  // declare the variables we need
  var particles = [],
      mainCanvas = null,
      mainContext = null,
      fireworkCanvas = null,
      fireworkContext = null,
      viewportWidth = 0,
      viewportHeight = 0;

  /**
   * Create DOM elements and get your game on
   */
  function initialize() {

    // start by measuring the viewport
    onWindowResize();

    // create a canvas for the fireworks
    mainCanvas = document.createElement('canvas');
    //mainCanvas.id = "nogl";
    mainCanvas.id = "camera";
    mainContext = mainCanvas.getContext('2d');

    // and another one for, like, an off screen buffer
    // because that's rad n all
    fireworkCanvas = document.createElement('canvas');
    fireworkContext = fireworkCanvas.getContext('2d');

    // set up the colours for the fireworks
    createFireworkPalette(12);

    // set the dimensions on the canvas
    setMainCanvasDimensions();

    // add the canvas in
    document.body.appendChild(mainCanvas);
    //document.addEventListener('mouseup', createFirework, true);
    //document.addEventListener('touchend', createFirework, true);

    var video = document.getElementById("live");//$("#live").get()[0];
    var canvas = mainCanvas;
    var ctx = canvas.getContext('2d');
    var options = {
      "video": true
    };
      // use the chrome specific GetUserMedia function
    navigator.webkitGetUserMedia(options, function(stream) {
      video.src = webkitURL.createObjectURL(stream);
    }, function(err) {
    console.log("Unable to get video stream!")
    });

    timer = setInterval(
    function() {
    ctx.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
    }, 0);

    this.ctx = ctx;
    this.canvas = canvas;
    // and now we set off
    update();

    var GLSL, error, gl, gui, nogl;

      GLSL = {
        vert: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Uniforms\nuniform vec2 u_resolution;\n\n// Attributes\nattribute vec2 a_position;\n\nvoid main() {\n    gl_Position = vec4 (a_position, 0, 1);\n}\n",
        frag: "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform bool u_scanlines;\nuniform vec2 u_resolution;\n\nuniform float u_brightness;\nuniform float u_blobiness;\nuniform float u_particles;\nuniform float u_millis;\nuniform float u_energy;\n\n// http://goo.gl/LrCde\nfloat noise( vec2 co ){\n    return fract( sin( dot( co.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );\n}\n\nvoid main( void ) {\n\n    vec2 position = ( gl_FragCoord.xy / u_resolution.x );\n    float t = u_millis * 0.001 * u_energy;\n    \n    float a = 0.0;\n    float b = 0.0;\n    float c = 0.0;\n\n    vec2 pos, center = vec2( 0.5, 0.5 * (u_resolution.y / u_resolution.x) );\n    \n    float na, nb, nc, nd, d;\n    float limit = u_particles / 40.0;\n    float step = 1.0 / u_particles;\n    float n = 0.0;\n    \n    for ( float i = 0.0; i <= 1.0; i += 0.025 ) {\n\n        if ( i <= limit ) {\n\n            vec2 np = vec2(n, 1-1);\n            \n            na = noise( np * 1.1 );\n            nb = noise( np * 2.8 );\n            nc = noise( np * 0.7 );\n            nd = noise( np * 3.2 );\n\n            pos = center;\n            pos.x += sin(t*na) * cos(t*nb) * tan(t*na*0.15) * 0.3;\n            pos.y += tan(t*nc) * sin(t*nd) * 0.1;\n            \n            d = pow( 1.6*na / length( pos - position ), u_blobiness );\n            \n            if ( i < limit * 0.3333 ) a += d;\n            else if ( i < limit * 0.6666 ) b += d;\n            else c += d;\n\n            n += step;\n        }\n    }\n    \n    vec3 col = vec3(a*c,b*c,a*b) * 0.0001 * u_brightness;\n    \n    if ( u_scanlines ) {\n        col -= mod( gl_FragCoord.y, 2.0 ) < 1.0 ? 0.5 : 0.0;\n    }\n    \n    gl_FragColor = vec4( col, 1.0 );\n\n}\n"
      };

      try {
        gl = Sketch.create({
          container: document.getElementById('container'),
          type: Sketch.WEBGL,
          brightness: 0.8,
          blobiness: 1.5,
          particles: 40,
          energy: 1.01,
          scanlines: true
        });
      } catch (_error) {
        error = _error;
        nogl = document.getElementById('nogl');
        nogl.style.display = 'block';
        this.nogl = nogl;
      }

      if (gl) {
        gl.setup = function() {
          var frag, vert;
          this.clearColor(0.0, 0.0, 0.0, 1.0);
          vert = this.createShader(this.VERTEX_SHADER);
          frag = this.createShader(this.FRAGMENT_SHADER);
          this.shaderSource(vert, GLSL.vert);
          this.shaderSource(frag, GLSL.frag);
          this.compileShader(vert);
          this.compileShader(frag);
          if (!this.getShaderParameter(vert, this.COMPILE_STATUS)) {
            throw this.getShaderInfoLog(vert);
          }
          if (!this.getShaderParameter(frag, this.COMPILE_STATUS)) {
            throw this.getShaderInfoLog(frag);
          }
          this.shaderProgram = this.createProgram();
          this.attachShader(this.shaderProgram, vert);
          this.attachShader(this.shaderProgram, frag);
          this.linkProgram(this.shaderProgram);
          if (!this.getProgramParameter(this.shaderProgram, this.LINK_STATUS)) {
            throw this.getProgramInfoLog(this.shaderProgram);
          }
          this.useProgram(this.shaderProgram);
          this.shaderProgram.attributes = {
            position: this.getAttribLocation(this.shaderProgram, 'a_position')
          };
          this.shaderProgram.uniforms = {
            resolution: this.getUniformLocation(this.shaderProgram, 'u_resolution'),
            brightness: this.getUniformLocation(this.shaderProgram, 'u_brightness'),
            blobiness: this.getUniformLocation(this.shaderProgram, 'u_blobiness'),
            particles: this.getUniformLocation(this.shaderProgram, 'u_particles'),
            scanlines: this.getUniformLocation(this.shaderProgram, 'u_scanlines'),
            energy: this.getUniformLocation(this.shaderProgram, 'u_energy'),
            millis: this.getUniformLocation(this.shaderProgram, 'u_millis')
          };
          this.geometry = this.createBuffer();
          this.geometry.vertexCount = 6;
          this.bindBuffer(this.ARRAY_BUFFER, this.geometry);
          this.bufferData(this.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), this.STATIC_DRAW);
          this.enableVertexAttribArray(this.shaderProgram.attributes.position);
          this.vertexAttribPointer(this.shaderProgram.attributes.position, 2, this.FLOAT, false, 0, 0);
          return this.resize();
        };
        gl.updateUniforms = function() {
          if (!this.shaderProgram) {
            return;
          }
          this.uniform2f(this.shaderProgram.uniforms.resolution, this.width, this.height);
          this.uniform1f(this.shaderProgram.uniforms.brightness, this.brightness);
          this.uniform1f(this.shaderProgram.uniforms.blobiness, this.blobiness);
          this.uniform1f(this.shaderProgram.uniforms.particles, this.particles);
          this.uniform1i(this.shaderProgram.uniforms.scanlines, this.scanlines);
          return this.uniform1f(this.shaderProgram.uniforms.energy, this.energy);
        };
        gl.draw = function() {
          this.uniform1f(this.shaderProgram.uniforms.millis, this.millis + 5000);
          this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
          this.bindBuffer(this.ARRAY_BUFFER, this.geometry);
          return this.drawArrays(this.TRIANGLES, 0, this.geometry.vertexCount);
        };
        gl.resize = function() {
          this.viewport(0, 0, this.width, this.height);
          return this.updateUniforms();
        };
        /*gui = new dat.GUI();
        gui.add(gl, 'particles').step(1.0).min(8).max(40).onChange(function() {
          return gl.updateUniforms();
        });
        gui.add(gl, 'brightness').step(0.01).min(0.1).max(1.0).onChange(function() {
          return gl.updateUniforms();
        });
        gui.add(gl, 'blobiness').step(0.01).min(0.8).max(1.5).onChange(function() {
          return gl.updateUniforms();
        });
        gui.add(gl, 'energy').step(0.01).min(0.1).max(4.0).onChange(function() {
          return gl.updateUniforms();
        });
        gui.add(gl, 'scanlines').onChange(function() {
          return gl.updateUniforms();
        });
        gui.close();*/
      }

  }

  /**
   * Pass through function to create a
   * new firework on touch / click
   */
  function createFirework() {
    createParticle();
  }

  /**
   * Creates a block of colours for the
   * fireworks to use as their colouring
   */
  function createFireworkPalette(gridSize) {

    var size = gridSize * 10;
    fireworkCanvas.width = size;
    fireworkCanvas.height = size;
    fireworkContext.globalCompositeOperation = 'source-over';

    // create 100 blocks which cycle through
    // the rainbow... HSL is teh r0xx0rz
    for(var c = 0; c < 100; c++) {

      var marker = (c * gridSize);
      var gridX = marker % size;
      var gridY = Math.floor(marker / size) * gridSize;

      fireworkContext.fillStyle = "hsl(" + Math.round(c * 3.6) + ",100%,60%)";
      fireworkContext.fillRect(gridX, gridY, gridSize, gridSize);
      fireworkContext.drawImage(
        Library.bigGlow,
        gridX,
        gridY);
    }
  }

  /**
   * Update the canvas based on the
   * detected viewport size
   */
  function setMainCanvasDimensions() {
    mainCanvas.width = viewportWidth;
    mainCanvas.height = viewportHeight;
  }

  /**
   * The main loop where everything happens
   */
  function update() {
    //clearContext();
    requestAnimFrame(update);
    drawFireworks();
  }

  /**
   * Clears out the canvas with semi transparent
   * black. The bonus of this is the trails effect we get
   */
  function clearContext() {
    mainContext.fillStyle = "rgba(0,0,0,0.2)";
    mainContext.fillRect(0, 0, viewportWidth, viewportHeight);
  }

  /**
   * Passes over all particles particles
   * and draws them
   */
  function drawFireworks() {
    var a = particles.length;

    while(a--) {
      var firework = particles[a];

      // if the update comes back as true
      // then our firework should explode
      if(firework.update()) {

        // kill off the firework, replace it
        // with the particles for the exploded version
        particles.splice(a, 1);

        // if the firework isn't using physics
        // then we know we can safely(!) explode it... yeah.
        if(!firework.usePhysics) {

          if(Math.random() < 0.8) {
            FireworkExplosions.star(firework);
          } else {
            FireworkExplosions.circle(firework);
          }
        }
      }

      // pass the canvas context and the firework
      // colours to the
      firework.render(mainContext, fireworkCanvas);
    }
  }

  /**
   * Creates a new particle / firework
   */
  function createParticle(pos, target, vel, color, usePhysics) {

    pos = pos || {};
    target = target || {};
    vel = vel || {};

    particles.push(
      new Particle(
        // position
        {
          x: pos.x || viewportWidth * 0.5,
          y: pos.y || viewportHeight + 10
        },

        // target
        {
          y: target.y || 150 + Math.random() * 100
        },

        // velocity
        {
          x: vel.x || Math.random() * 3 - 1.5,
          y: vel.y || 0
        },

        color || Math.floor(Math.random() * 100) * 12,

        usePhysics)
    );
  }

  /**
   * Callback for window resizing -
   * sets the viewport dimensions
   */
  function onWindowResize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
  }

  
  function fadeIn(){
    console.log("run");
       document.getElementById("container").className += "show-nav";
  }

  function fadeOut(){
      var alpha = 0.0,   // full opacity
        interval = setInterval(function () {
            
            alpha = alpha + 0.05; // decrease opacity (fade out)
            console.log(this.Fireworks.nogl.getContext('2d').globalAlpha);

            var imgData = this.Fireworks.nogl.getContext('2d').getImageData(0, 0, window.innerWidth, window.innerHeight);
            this.Fireworks.nogl.getContext('2d').clearRect(0, 0, window.innerWidth, window.innerHeight);
            this.Fireworks.nogl.getContext('2d').globalAlpha = alpha;
            this.Fireworks.nogl.getContext('2d').fillStyle = 'rgba(225,225,225,' + alpha + ')';
            
            this.Fireworks.nogl.getContext('2d').putImageData(imgData,0,0);

            if (alpha > 1) {
                
                clearInterval(interval);
            }
        }, 50); 
  }

  // declare an API
  return {
    initialize: initialize,
    createParticle: createParticle,
    fadeIn: fadeIn,
    fadeOut: fadeOut
  };

})();

/**
 * Represents a single point, so the firework being fired up
 * into the air, or a point in the exploded firework
 */
var Particle = function(pos, target, vel, marker, usePhysics) {

  // properties for animation
  // and colouring
  this.GRAVITY  = 0.06;
  this.alpha    = 1;
  this.easing   = Math.random() * 0.02;
  this.fade     = Math.random() * 0.1;
  this.gridX    = marker % 120;
  this.gridY    = Math.floor(marker / 120) * 12;
  this.color    = marker;

  this.pos = {
    x: pos.x || 0,
    y: pos.y || 0
  };

  this.vel = {
    x: vel.x || 0,
    y: vel.y || 0
  };

  this.lastPos = {
    x: this.pos.x,
    y: this.pos.y
  };

  this.target = {
    y: target.y || 0
  };

  this.usePhysics = usePhysics || false;

};

/**
 * Functions that we'd rather like to be
 * available to all our particles, such
 * as updating and rendering
 */
Particle.prototype = {

  update: function() {

    this.lastPos.x = this.pos.x;
    this.lastPos.y = this.pos.y;

    if(this.usePhysics) {
      this.vel.y += this.GRAVITY;
      this.pos.y += this.vel.y;

      // since this value will drop below
      // zero we'll occasionally see flicker,
      // ... just like in real life! Woo! xD
      this.alpha -= this.fade;
    } else {

      var distance = (this.target.y - this.pos.y);

      // ease the position
      this.pos.y += distance * (0.03 + this.easing);

      // cap to 1
      this.alpha = Math.min(distance * distance * 0.00005, 1);
    }

    this.pos.x += this.vel.x;

    return (this.alpha < 0.005);
  },

  render: function(context, fireworkCanvas) {

    var x = Math.round(this.pos.x),
        y = Math.round(this.pos.y),
        xVel = (x - this.lastPos.x) * -5,
        yVel = (y - this.lastPos.y) * -5;

    context.save();
    context.globalCompositeOperation = 'lighter';
    context.globalAlpha = Math.random() * this.alpha;

    // draw the line from where we were to where
    // we are now
    context.fillStyle = "rgba(255,255,255,0.3)";
    context.beginPath();
    context.moveTo(this.pos.x, this.pos.y);
    context.lineTo(this.pos.x + 1.5, this.pos.y);
    context.lineTo(this.pos.x + xVel, this.pos.y + yVel);
    context.lineTo(this.pos.x - 1.5, this.pos.y);
    context.closePath();
    context.fill();

    // draw in the images
    context.drawImage(fireworkCanvas,
      this.gridX, this.gridY, 12, 12,
      x - 6, y - 6, 12, 12);
    context.drawImage(Library.smallGlow, x - 3, y - 3);

    context.restore();
  }

};

/**
 * Stores references to the images that
 * we want to reference later on
 */
var Library = {
  bigGlow: document.getElementById('big-glow'),
  smallGlow: document.getElementById('small-glow')
};

/**
 * Stores a collection of functions that
 * we can use for the firework explosions. Always
 * takes a firework (Particle) as its parameter
 */
var FireworkExplosions = {

  /**
   * Explodes in a roughly circular fashion
   */
  circle: function(firework) {

    var count = 100;
    var angle = (Math.PI * 2) / count;
    while(count--) {

      var randomVelocity = 4 + Math.random() * 4;
      var particleAngle = count * angle;

      Fireworks.createParticle(
        firework.pos,
        null,
        {
          x: Math.cos(particleAngle) * randomVelocity,
          y: Math.sin(particleAngle) * randomVelocity
        },
        firework.color,
        true);
    }
  },

  /**
   * Explodes in a star shape
   */
  star: function(firework) {

    // set up how many points the firework
    // should have as well as the velocity
    // of the exploded particles etc
    var points          = 6 + Math.round(Math.random() * 15);
    var jump            = 3 + Math.round(Math.random() * 7);
    var subdivisions    = 10;
    var radius          = 80;
    var randomVelocity  = -(Math.random() * 3 - 6);

    var start           = 0;
    var end             = 0;
    var circle          = Math.PI * 2;
    var adjustment      = Math.random() * circle;

    do {

      // work out the start, end
      // and change values
      start = end;
      end = (end + jump) % points;

      var sAngle = (start / points) * circle - adjustment;
      var eAngle = ((start + jump) / points) * circle - adjustment;

      var startPos = {
        x: firework.pos.x + Math.cos(sAngle) * radius,
        y: firework.pos.y + Math.sin(sAngle) * radius
      };

      var endPos = {
        x: firework.pos.x + Math.cos(eAngle) * radius,
        y: firework.pos.y + Math.sin(eAngle) * radius
      };

      var diffPos = {
        x: endPos.x - startPos.x,
        y: endPos.y - startPos.y,
        a: eAngle - sAngle
      };

      // now linearly interpolate across
      // the subdivisions to get to a final
      // set of particles
      for(var s = 0; s < subdivisions; s++) {

        var sub = s / subdivisions;
        var subAngle = sAngle + (sub * diffPos.a);

        Fireworks.createParticle(
          {
            x: startPos.x + (sub * diffPos.x),
            y: startPos.y + (sub * diffPos.y)
          },
          null,
          {
            x: Math.cos(subAngle) * randomVelocity,
            y: Math.sin(subAngle) * randomVelocity
          },
          firework.color,
          true);
      }

    // loop until we're back at the start
    } while(end !== 0);

  }

};

// Go
window.onload = function() {
  Fireworks.initialize();
};
