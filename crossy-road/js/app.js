// Generated by CoffeeScript 1.10.0
var config, crossScene, cyclic, engine, nextModel, roadWidth,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

engine = null;

config = null;

crossScene = null;

cyclic = null;

roadWidth = 6;

nextModel = function() {
  var player, scene;
  scene = SceneManager.get().currentScene();
  player = scene.player;
  scene.scene.remove(player.mesh);
  player.setModel(cyclic.next());
  return scene.scene.add(player.mesh);
};

document.addEventListener('DOMContentLoaded', function() {
  var Car, CrossScene, Entity, Obstacle, Player, Road;
  cyclic = new CyclicArray([
    {
      type: 'chicken',
      scale: 5,
      timescale: 3
    }, {
      type: 'dummy',
      scale: 0.1,
      timescale: 4
    }, {
      type: 'fire-elemental',
      scale: 0.25,
      timescale: 6
    }, {
      type: 'chicken',
      skin: 'black_chicken',
      scale: 5,
      timescale: 3
    }
  ]);
  config = Config.get();
  config.fillWindow();
  Helper.addCEButton({
    type: 'fullscreen'
  });
  Helper.addCEButton({
    type: 'reinit',
    position: 'bottom-left'
  });
  Utils.orientation('landscape');
  engine = new Engine3D();
  Entity = (function(superClass) {
    extend(Entity, superClass);

    function Entity() {
      return Entity.__super__.constructor.apply(this, arguments);
    }

    Entity.prototype.randomZ = function() {
      this.mesh.position.x = Helper.random(roadWidth + 1);
      if (Math.random() < 0.5) {
        return this.mesh.position.x *= -1;
      }
    };

    Entity.prototype.getPosition = function() {
      return {
        x: Math.floor(this.mesh.position.x),
        y: Math.floor(this.mesh.position.y),
        z: Math.floor(this.mesh.position.z)
      };
    };

    return Entity;

  })(BaseModel);
  Player = (function(superClass) {
    extend(Player, superClass);

    function Player() {
      this.raycaster = new THREE.Raycaster();
      this.leftEdge = new THREE.Vector3(0.5, 0, 0);
      this.rightEdge = new THREE.Vector3(-0.5, 0, 0);
      this.dead = false;
      this.moving = false;
      this.setModel(cyclic.get());
    }

    Player.prototype.setModel = function(json) {
      var old_mesh;
      this.json = json;
      old_mesh = (this.mesh != null ? this.mesh.position : Helper.zero).clone();
      this.mesh = JsonModelManager.get().clone(json.type);
      this.mesh.position.set(old_mesh.x, old_mesh.y, old_mesh.z);
      this.mesh.scale.set(json.scale, json.scale, json.scale);
      if (json.skin != null) {
        this.setSkin(json.skin);
      }
      return this.animate('idle');
    };

    Player.prototype.isAllowedMove = function(direction, roads) {
      var item, k, l, len, len1, len2, len3, m, n, ref, ref1, ref2, ref3;
      if (direction === 'w') {
        if (roads.size() !== 3) {
          return false;
        }
        ref = roads[2].items;
        for (k = 0, len = ref.length; k < len; k++) {
          item = ref[k];
          if (item instanceof Obstacle) {
            if (item.mesh.position.x === this.getPosition().x) {
              return false;
            }
          }
        }
      }
      if (direction === 's') {
        if (roads.size() !== 3) {
          return false;
        }
        ref1 = roads[0].items;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          item = ref1[l];
          if (item instanceof Obstacle) {
            if (item.mesh.position.x === this.getPosition().x) {
              return false;
            }
          }
        }
      }
      if (direction === 'a') {
        if (this.getPosition().x >= roadWidth) {
          return false;
        }
        ref2 = roads[1].items;
        for (m = 0, len2 = ref2.length; m < len2; m++) {
          item = ref2[m];
          if (item instanceof Obstacle) {
            if (item.mesh.position.x - 1 === this.getPosition().x) {
              return false;
            }
          }
        }
      }
      if (direction === 'd') {
        if (this.getPosition().x <= -roadWidth) {
          return false;
        }
        ref3 = roads[1].items;
        for (n = 0, len3 = ref3.length; n < len3; n++) {
          item = ref3[n];
          if (item instanceof Obstacle) {
            if (item.mesh.position.x + 1 === this.getPosition().x) {
              return false;
            }
          }
        }
      }
      return true;
    };

    Player.prototype.intersects = function(item) {
      var intersectsLeft, intersectsRight, pos;
      pos = this.mesh.position;
      this.raycaster.set(pos, this.leftEdge);
      intersectsLeft = this.raycaster.intersectObject(item.mesh);
      this.raycaster.set(pos, this.rightEdge);
      intersectsRight = this.raycaster.intersectObject(item.mesh);
      return intersectsLeft.any() || intersectsRight.any();
    };

    Player.prototype.move = function(direction, roads) {
      var target, tween;
      if (this.moving) {
        return;
      }
      if (!this.isAllowedMove(direction, roads)) {
        return;
      }
      this.moving = true;
      target = this.mesh.position.clone();
      switch (direction) {
        case 'w':
          target.z += 1;
          this.mesh.rotation.y = 0;
          break;
        case 's':
          target.z -= 1;
          this.mesh.rotation.y = Math.PI;
          break;
        case 'a':
          target.x += 1;
          this.mesh.rotation.y = Math.PI / 2;
          break;
        case 'd':
          target.x -= 1;
          this.mesh.rotation.y = -Math.PI / 2;
      }
      this.stopAnimations();
      this.animate('jump', {
        timeScale: this.json.timescale
      });
      tween = Helper.tween({
        target: target,
        mesh: this.mesh,
        duration: 250
      }).onComplete((function(_this) {
        return function() {
          _this.moving = false;
          if (_this.dead) {
            return;
          }
          _this.stopAnimations();
          return _this.animate('idle');
        };
      })(this));
      return tween.start();
    };

    return Player;

  })(Entity);
  Road = (function(superClass) {
    extend(Road, superClass);

    function Road(index) {
      var map, texture;
      this.items = [];
      this.type = ['land', 'car'].random();
      if (index === 0) {
        this.type = 'land';
      }
      this.mesh = new THREE.Object3D();
      map = this.type === 'land' ? 'road-row' : 'road-row-road';
      texture = TextureManager.get().items[map];
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(50, 1);
      this.road = Helper.plane({
        width: 50,
        height: 1,
        map: map
      });
      if (this.type === 'land') {
        this.border1 = JsonModelManager.get().clone('fence');
        this.border1.rotation.set(Math.PI / 2, Math.PI / 2, 0);
        this.border1.scale.set(0.5, 0.5, 0.5);
        this.border1.position.x = roadWidth + 1;
        this.road.add(this.border1);
        this.border2 = JsonModelManager.get().clone('fence');
        this.border2.rotation.set(Math.PI / 2, Math.PI / 2, 0);
        this.border2.scale.set(0.5, 0.5, 0.5);
        this.border2.position.x -= roadWidth + 1;
        this.road.add(this.border2);
      }
      this.road.rotation.set(-Math.PI / 2, 0, 0);
      this.mesh.add(this.road);
      this.init(index);
    }

    Road.prototype.init = function(i) {
      var j, k, results;
      this.mesh.position.z = i;
      if (i === 0) {
        return;
      }
      if (this.type === 'land') {
        results = [];
        for (j = k = 0; k <= 3; j = ++k) {
          results.push(this.addItem(Obstacle));
        }
        return results;
      } else if (this.type === 'car') {
        return this.addItem(Car);
      }
    };

    Road.prototype.addItem = function(klass) {
      var item;
      item = new klass();
      item.randomZ();
      this.items.push(item);
      return this.mesh.add(item.mesh);
    };

    Road.prototype.tick = function(tpf) {
      var item, k, len, ref, results;
      ref = this.items;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        item = ref[k];
        if (item instanceof Car) {
          results.push(item.move(tpf));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Road;

  })(Entity);
  Car = (function(superClass) {
    extend(Car, superClass);

    function Car() {
      var type;
      type = ['car-base', 'truck-base'].random();
      this.mesh = JsonModelManager.get().clone(type);
      this.mesh.scale.set(0.8, 0.8, 0.8);
      this.mesh.rotation.y = -Math.PI / 2;
      this.speed = 5;
      if (Math.random() < 0.5) {
        if (type === 'car-base') {
          this.setSkin(type + "-yellow");
        }
        this.speed = 7.5;
      }
    }

    Car.prototype.move = function(tpf) {
      var edge;
      this.mesh.translateZ(tpf * this.speed);
      edge = 15;
      if (this.mesh.position.x < -edge) {
        if (Math.random() < 0.5) {
          this.speed = 5;
        } else {
          this.speed = 7.5;
        }
        return this.mesh.position.x = edge;
      }
    };

    return Car;

  })(Entity);
  Obstacle = (function(superClass) {
    extend(Obstacle, superClass);

    function Obstacle() {
      var type;
      type = ['pinetree', 'trunk'].random();
      this.mesh = JsonModelManager.get().clone(type);
      if (type === 'trunk') {
        this.mesh.scale.set(0.2, 0.2, 0.2);
      }
      if (type === 'pinetree') {
        this.mesh.scale.set(0.5, 0.5, 0.5);
      }
    }

    return Obstacle;

  })(Entity);
  CrossScene = (function(superClass) {
    extend(CrossScene, superClass);

    function CrossScene() {
      return CrossScene.__super__.constructor.apply(this, arguments);
    }

    CrossScene.prototype.init = function(options) {
      var i, k, lookAt, road;
      this.cameraOffsetZ = -2;
      this.roads = [];
      engine.camera.position.set(-0.4, 9, this.cameraOffsetZ);
      lookAt = Helper.zero.clone();
      lookAt.x = 0.2;
      lookAt.z = 3;
      engine.camera.lookAt(lookAt);
      this.scene.add(Helper.ambientLight());
      this.scene.add(Helper.ambientLight());
      this.scene.add(Helper.ambientLight());
      this.light = Helper.light();
      this.light.position.set(0, 60, 0);
      this.scene.add(this.light);
      for (i = k = -4; k <= 14; i = ++k) {
        road = new Road(i);
        this.roads.push(road);
        this.scene.add(road.mesh);
      }
      this.player = new Player();
      this.scene.add(this.player.mesh);
      this.score = document.getElementsByClassName('score')[0];
      this.hammer = new Hammer(engine.renderer.domElement);
      this.hammer.get('swipe').set({
        direction: Hammer.DIRECTION_ALL
      });
      this.hammer.get('tap').set({
        interval: 125
      });
      this.hammer.on('tap', (function(_this) {
        return function(event) {
          var roads;
          if (_this.player.dead) {
            return;
          }
          roads = _this.getRoadsAround(_this.player.getPosition().z);
          return _this.player.move('w', roads);
        };
      })(this));
      this.hammer.on('swipeup', (function(_this) {
        return function(event) {
          var roads;
          if (_this.player.dead) {
            return;
          }
          roads = _this.getRoadsAround(_this.player.getPosition().z);
          return _this.player.move('w', roads);
        };
      })(this));
      this.hammer.on('swipedown', (function(_this) {
        return function(event) {
          var roads;
          if (_this.player.dead) {
            return;
          }
          roads = _this.getRoadsAround(_this.player.getPosition().z);
          return _this.player.move('s', roads);
        };
      })(this));
      this.hammer.on('swipeleft', (function(_this) {
        return function(event) {
          var roads;
          if (_this.player.dead) {
            return;
          }
          roads = _this.getRoadsAround(_this.player.getPosition().z);
          return _this.player.move('a', roads);
        };
      })(this));
      return this.hammer.on('swiperight', (function(_this) {
        return function(event) {
          var roads;
          if (_this.player.dead) {
            return;
          }
          roads = _this.getRoadsAround(_this.player.getPosition().z);
          return _this.player.move('d', roads);
        };
      })(this));
    };

    CrossScene.prototype.getCameraPosition = function() {
      return Math.floor(engine.camera.position.z + this.cameraOffsetZ * -1);
    };

    CrossScene.prototype.getPlayerDistance = function() {
      return Math.floor(this.player.mesh.position.z);
    };

    CrossScene.prototype.getRoadsAround = function(z) {
      var k, len, pos, ref, result, road;
      result = [];
      ref = this.roads;
      for (k = 0, len = ref.length; k < len; k++) {
        road = ref[k];
        pos = road.mesh.position.z;
        if (pos === z || pos - 1 === z || pos + 1 === z) {
          result.push(road);
        }
      }
      return result;
    };

    CrossScene.prototype.tick = function(tpf) {
      var k, len, ref, road, roads;
      if (this.player == null) {
        return;
      }
      ref = this.roads;
      for (k = 0, len = ref.length; k < len; k++) {
        road = ref[k];
        road.tick(tpf);
      }
      if (this.player.dead) {
        return;
      }
      roads = this.getRoadsAround(this.player.getPosition().z);
      if (this._isDead(roads)) {
        this.hammer.get('swipe').set({
          enable: false
        });
        this.player.dead = true;
        this.player.stopAnimations();
        this.player.animate('die', {
          loop: false
        });
        return;
      }
      if (this.keyboard.pressed('w')) {
        this.player.move('w', roads);
      }
      if (this.keyboard.pressed('s')) {
        this.player.move('s', roads);
      }
      if (this.keyboard.pressed('a')) {
        this.player.move('a', roads);
      }
      if (this.keyboard.pressed('d')) {
        this.player.move('d', roads);
      }
      if (this.player.mesh.position.z > engine.camera.position.z + (this.cameraOffsetZ * -1)) {
        engine.camera.position.z += tpf;
      }
      this._setScore();
      return this._infiniteRoad();
    };

    CrossScene.prototype._setScore = function() {
      return this.score.innerHTML = this.player.getPosition().z;
    };

    CrossScene.prototype._isDead = function(roads) {
      var item, k, l, len, len1, ref, road;
      for (k = 0, len = roads.length; k < len; k++) {
        road = roads[k];
        ref = road.items;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          item = ref[l];
          if (item instanceof Car) {
            if (this.player.intersects(item)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    CrossScene.prototype._infiniteRoad = function() {
      var k, len, ref, road;
      ref = this.roads;
      for (k = 0, len = ref.length; k < len; k++) {
        road = ref[k];
        if (road.mesh.position.z + 4 < Math.floor(engine.camera.position.z)) {
          road.mesh.position.z = this.roads.last().mesh.position.z + 1;
        }
      }
      return this.roads = this.roads.sort(function(a, b) {
        return a.mesh.position.z - b.mesh.position.z;
      });
    };

    CrossScene.prototype.doMouseEvent = function(event, raycaster) {};

    CrossScene.prototype.doKeyboardEvent = function(event) {};

    return CrossScene;

  })(BaseScene);
  crossScene = new CrossScene();
  SceneManager.get().addScene(crossScene);
  Engine3D.scenify(function() {
    return engine.initScene(crossScene);
  });
  engine.render();
});
