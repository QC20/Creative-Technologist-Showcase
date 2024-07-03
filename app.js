// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Common = Matter.Common;

// Initialize variables
var engine;
var render;
var blocks = [];
var walls = [];
var ground;
var ceiling;
var hBlocks = document.getElementsByClassName("anarchy");
var pageWidth = 0;
var videoElement;

window.onload = function() {
  pageWidth = window.innerWidth;
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

function createBody(x, y, w, h, isCircle) {
  var options = {
    density: 0.01,
    friction: 0.5,
    restitution: 0.2,
    collisionFilter: {
      category: 0x0001,
      mask: 0xFFFFFFFF
    },
    chamfer: { radius: 5 }
  };
  
  var body;
  if (isCircle) {
    body = Bodies.circle(x, y, w / 2, options);
  } else {
    body = Bodies.rectangle(x, y, w, h, options);
  }
  
  var xVel = 5 * Math.random() - 2.5;
  Body.setVelocity(body, { x: xVel, y: 0 });
  World.add(engine.world, [body]);
  return body;
}

function setup() {
  engine = Engine.create();
  engine.world.gravity.y = -0.5;
  engine.world.gravity.scale = 0.001;
  engine.world.bounds.max.y = 40000;
  engine.world.bounds.max.x = 20000;

  // Increase default stiffness
  engine.world.constraintIterations = 10;

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
    
    var isCircle = hBlocks[i].classList.contains("ball");
    var body = createBody(
      window.innerWidth / 2, 
      startHeight, 
      hBlocks[i].offsetWidth, 
      hBlocks[i].offsetHeight,
      isCircle
    );
    
    blocks.push({ body: body, element: hBlocks[i] });
  }

  var wallOptions = { 
    isStatic: true, 
    restitution: 0.2,
    friction: 0.5,
    collisionFilter: {
      category: 0x0001,
      mask: 0xFFFFFFFF
    }
  };

  ground = Bodies.rectangle(10000, -50, 20000, 100, wallOptions);
  ceiling = Bodies.rectangle(10000, 40050, 20000, 100, wallOptions);
  walls[0] = Bodies.rectangle(-50, 20000, 100, 40000, wallOptions);
  walls[1] = Bodies.rectangle(window.innerWidth + 50, 20000, 100, 40000, wallOptions);
  
  World.add(engine.world, [ground, ceiling, walls[0], walls[1]]);
}

function draw() {
  World.add(engine.world, [ground, ceiling, walls[0], walls[1]]);
}

setup();
draw();

(function render() {
  Engine.update(engine, 1000 / 60);
  
  // Separate overlapping bodies
  var pairs = engine.world.pairs.list;
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    Body.setPosition(pair.bodyA, {
      x: pair.bodyA.position.x + pair.separation * pair.normal.x,
      y: pair.bodyA.position.y + pair.separation * pair.normal.y
    });
    Body.setPosition(pair.bodyB, {
      x: pair.bodyB.position.x - pair.separation * pair.normal.x,
      y: pair.bodyB.position.y - pair.separation * pair.normal.y
    });
  }

  Body.setPosition(walls[1], { x: document.body.clientWidth + 50, y: 0 });
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    var xTrans = block.body.position.x - block.element.offsetWidth / 2;
    var yTrans = block.body.position.y - block.element.offsetHeight / 2;
    block.element.style.transform = "translate(" + xTrans + "px, " + yTrans + "px) rotate(" + block.body.angle + "rad)";
    block.element.style.visibility = "visible";
  }
  window.requestAnimationFrame(render);
})();