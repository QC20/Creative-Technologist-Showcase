// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

// Initialize variables
var engine;
var render;
var balls = [];
var walls = [];
var ground;
var ceiling;
var blocks = [];
var hBlocks = document.getElementsByClassName("anarchy");
var pageWidth = 0;

window.onload = function() {
  pageWidth = window.innerWidth;
  /*
  // Request access to the webcam
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      var videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.play();

      var mirrorBall = document.getElementById('mirrorBall');
      mirrorBall.appendChild(videoElement);

      videoElement.classList.add('mirror-video');
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });
  */
};

window.onresize = function() {
  var newpageWidth = window.innerWidth;
  if (newpageWidth < pageWidth) {
    for (var i = 0; i < blocks.length; i++) {
      Body.setPosition(blocks[i].body, { x: newpageWidth / 2, y: window.innerHeight + 500 + (50 * i) });
    }
  }
  pageWidth = newpageWidth;
};

function Box(x, y, w, h) {
  var options = {
    density: 0.0005,
    friction: 0.5,
    restitution: 0.7,
    collisionFilter: {
      category: 0x0002,
      mask: 0x0003
    }
  };
  this.body = Bodies.rectangle(x, y, w, h, options);
  var xVel = 10 * Math.random() - 5;
  Body.setVelocity(this.body, { x: xVel, y: 0 });
  World.add(engine.world, [this.body]);
}

function Ball(x, y, r) {
  var options = {
    density: 0.0005,
    friction: 0.5,
    restitution: 0.7,
    collisionFilter: {
      category: 0x0002,
      mask: 0x0003
    }
  };
  this.body = Bodies.circle(x, y, r, options);
  var xVel = 10 * Math.random() - 5;
  Body.setVelocity(this.body, { x: xVel, y: 0 });
  World.add(engine.world, [this.body]);
}

function setup() {
  engine = Engine.create();
  engine.world.gravity.y = -0.5;

  render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      showAngleIndicator: true
    }
  });
  Render.run(render);

  for (var i = 0; i < hBlocks.length; i++) {
    var startHeight = window.innerHeight;
    if (hBlocks[i].classList.contains("prio1")) {
      startHeight += 500;
    } else if (hBlocks[i].classList.contains("prio2")) {
      startHeight += 3000;
    } else if (hBlocks[i].classList.contains("prio3")) {
      startHeight += 5500;
    } else if (hBlocks[i].classList.contains("prio4")) {
      startHeight += 6000;
    } else if (hBlocks[i].classList.contains("prio5")) {
      startHeight += 7000;
    } else if (hBlocks[i].classList.contains("prio6")) {
      startHeight += 8000;
    } else {
      startHeight += 10000;
    }
    if (hBlocks[i].classList.contains("ball")) {
      // Create a ball with mirror effect
      var ballElement = document.createElement('div');
      ballElement.classList.add('mirror-ball');
      ballElement.id = 'mirrorBall';
      hBlocks[i].appendChild(ballElement);
      
      blocks.push(new Ball(window.innerWidth / 2, startHeight, hBlocks[i].offsetWidth / 2));
    } else if (hBlocks[i].classList.contains("block")) {
      blocks.push(new Box(window.innerWidth / 2, startHeight, hBlocks[i].offsetWidth, hBlocks[i].offsetHeight));
    }
  }

  ground = Bodies.rectangle(10000, -50, 20000, 100, { 
    isStatic: true,
    collisionFilter: {
      category: 0x0001,
      mask: 0x0002
    }
  });
  ceiling = Bodies.rectangle(10000, 40050, 20000, 100, { 
    isStatic: true,
    collisionFilter: {
      category: 0x0001,
      mask: 0x0002
    }
  });
  walls[0] = Bodies.rectangle(-50, 20000, 100, 40000, { 
    isStatic: true,
    collisionFilter: {
      category: 0x0001,
      mask: 0x0002
    }
  });
  walls[1] = Bodies.rectangle(window.innerWidth + 50, 20000, 100, 40000, { 
    isStatic: true,
    collisionFilter: {
      category: 0x0001,
      mask: 0x0002
    }
  });
  
  World.add(engine.world, [ground, ceiling, walls[0], walls[1]]);
}

function draw() {
  World.add(engine.world, [ground, ceiling, walls[0], walls[1]]);
}

setup();
draw();

(function render() {
  Engine.update(engine, 1000 / 60);
  Body.setPosition(walls[1], { x: document.body.clientWidth + 50, y: 0 });
  for (var i = 0; i < blocks.length; i++) {
    var xTrans = blocks[i].body.position.x - hBlocks[i].offsetWidth / 2;
    var yTrans = blocks[i].body.position.y - hBlocks[i].offsetHeight / 2;
    hBlocks[i].style.transform = "translate(" + xTrans + "px, " + yTrans + "px) rotate(" + blocks[i].body.angle + "rad)";
    hBlocks[i].style.visibility = "visible";
  }
  window.requestAnimationFrame(render);
})();