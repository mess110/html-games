// Generated by CoffeeScript 1.12.7
var Box,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Box = (function(superClass) {
  extend(Box, superClass);

  function Box(color, size) {
    if (size == null) {
      size = 1;
    }
    Box.__super__.constructor.call(this);
    this.id = Helper.guid();
    this.weapons = Config.weapons.toCyclicArray();
    this.moving = false;
    this.speed = 4;
    this.rotSpeed = 2;
    this.rot = 0;
    this.collisionRadius = 1;
    this.lastModel = void 0;
    this.mesh = new THREE.Object3D();
    this.model = Helper.cube({
      size: size,
      material: 'MeshLambertMaterial',
      color: color
    });
    this.mesh.add(this.model);
    this.targetOpacity = 1;
    this.opacity = 1;
    this.pos = {
      x: this.mesh.position.x,
      y: this.mesh.position.y,
      z: this.mesh.position.z
    };
  }

  Box.prototype.releaseIfPassed = function() {
    if (this.mesh.position.z < -10 || this.mesh.position.z > Config.mapTop) {
      return PoolManager.release(this, {
        skipExplosion: true
      });
    }
  };

  Box.prototype.move = function(tpf) {
    return Helper.moveTowards(this.speed, tpf, this.mesh.position, this.pos);
  };

  Box.prototype.rotate = function(tpf) {
    if (this.mesh.position.x < this.pos.x) {
      if (this.mesh.rotation.y === Math.PI) {
        this.rot = Helper.addWithMinMax(this.rot, this.rotSpeed * tpf, -0.5, 0.5);
      } else {
        this.rot = Helper.addWithMinMax(this.rot, -this.rotSpeed * tpf, -0.5, 0.5);
      }
    } else if (this.mesh.position.x > this.pos.x) {
      if (this.mesh.rotation.y === Math.PI) {
        this.rot = Helper.addWithMinMax(this.rot, -this.rotSpeed * tpf, -0.5, 0.5);
      } else {
        this.rot = Helper.addWithMinMax(this.rot, this.rotSpeed * tpf, -0.5, 0.5);
      }
    } else {
      this.rot = Helper.tendToZero(this.rot, this.rotSpeed * tpf);
    }
    return this.mesh.rotation.z = this.rot;
  };

  Box.prototype.tickOpacity = function(tpf) {
    var amount, mat;
    amount = tpf * 2;
    if (this.targetOpacity > this.opacity) {
      this.opacity = Helper.addWithMinMax(this.opacity, amount, 0, 1);
    }
    if (this.targetOpacity < this.opacity) {
      this.opacity = Helper.addWithMinMax(this.opacity, -amount, 0, 1);
    }
    mat = this.model.material.materials[0];
    if (mat.transparent === false) {
      mat.transparent = true;
    }
    if (mat.opacity !== this.opacity) {
      return mat.opacity = this.opacity;
    }
  };

  Box.prototype.collidesWith = function(enemy) {
    return Helper.distanceTo(enemy.mesh.position, this.mesh.position) < this.collisionRadius;
  };

  Box.prototype.setStartPosition = function() {
    throw 'not implemented';
  };

  Box.prototype.nextWeapon = function() {
    if (this.isLastWeapon()) {
      return;
    }
    return this.weapons.next();
  };

  Box.prototype.isLastWeapon = function() {
    return this.weapons.index === this.weapons.size() - 1;
  };

  Box.prototype.shoot = function() {
    switch (this.weapons.get()) {
      case Bullet:
        PoolManager.spawn(this.weapons.get(), {
          src: this
        });
        break;
      case Laser:
        PoolManager.spawn(this.weapons.get(), {
          src: this,
          offsetX: -0.2
        });
        PoolManager.spawn(this.weapons.get(), {
          src: this,
          offsetX: 0.2
        });
        break;
      case Bomb:
        PoolManager.spawn(this.weapons.get(), {
          src: this,
          offsetX: -0.3,
          rY: 0.2
        });
        PoolManager.spawn(this.weapons.get(), {
          src: this,
          offsetX: 0,
          offsetZ: 0.4
        });
        PoolManager.spawn(this.weapons.get(), {
          src: this,
          offsetX: 0.3,
          rY: -0.2
        });
    }
    return Helper.tween({
      mesh: this.getModelMesh(),
      target: {
        z: -(0.12 * (this.weapons.index + 1))
      },
      kind: 'Cubic',
      direction: 'Out',
      duration: (SceneManager.currentScene().shootTicker.getRate() / 4) * 1000
    }).start();
  };

  Box.prototype.addSpeed = function(amount) {
    return this.speed = Helper.addWithMinMax(this.speed, amount, 0, 20);
  };

  Box.prototype.setTarget = function(pos) {
    return this.pos = {
      x: pos.x,
      y: pos.y,
      z: pos.z
    };
  };

  Box.prototype.getModelMesh = function() {
    if (this.model instanceof BaseModel) {
      return this.model.mesh;
    } else {
      return this.model;
    }
  };

  Box.prototype.setModel = function(key) {
    this.mesh.remove(this.getModelMesh());
    this.lastModel = key;
    this.model = JsonModelManager.clone(key);
    return this.mesh.add(this.model);
  };

  Box.prototype.setSkin = function(key) {
    var tex;
    tex = TextureManager.get().items[key];
    if (tex == null) {
      throw new Error('texture not loaded');
    }
    return this.model.material.materials[0].map = tex;
  };

  Box.prototype.reset = function() {
    throw 'not implemented';
  };

  Box.prototype.toJson = function() {
    var cube, j, json, len, ref;
    json = {
      id: this.id,
      mesh: {
        position: this.mesh.position.clone(),
        rotation: this.mesh.rotation.clone()
      }
    };
    if (this.model != null) {
      json.model = {
        position: this.model.position.clone(),
        rotation: this.model.rotation.clone()
      };
    }
    if (this.cubes != null) {
      json.cubes = [];
      ref = this.cubes;
      for (j = 0, len = ref.length; j < len; j++) {
        cube = ref[j];
        json.cubes.push({
          position: cube.mesh.position.clone(),
          scale: cube.mesh.scale.clone()
        });
      }
    }
    return json;
  };

  Box.prototype.fromJson = function(json) {
    var cube, i, j, len, ref, results;
    this.mesh.position.set(json.mesh.position.x, json.mesh.position.y, json.mesh.position.z);
    this.mesh.rotation.set(json.mesh.rotation.x, json.mesh.rotation.y, json.mesh.rotation.z);
    if (json.model != null) {
      this.model.position.set(json.model.position.x, json.model.position.y, json.model.position.z);
      this.model.rotation.set(json.model.rotation.x, json.model.rotation.y, json.model.rotation.z);
    }
    if (json.cubes != null) {
      i = 0;
      ref = json.cubes;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        cube = ref[j];
        this.cubes[i].mesh.position.x = cube.position.x;
        this.cubes[i].mesh.position.y = cube.position.y;
        this.cubes[i].mesh.position.z = cube.position.z;
        this.cubes[i].mesh.scale.x = cube.scale.x;
        this.cubes[i].mesh.scale.y = cube.scale.y;
        this.cubes[i].mesh.scale.z = cube.scale.z;
        results.push(i += 1);
      }
      return results;
    }
  };

  return Box;

})(BaseModel);
