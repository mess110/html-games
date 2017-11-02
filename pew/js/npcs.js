// Generated by CoffeeScript 1.12.7
var BaseAmmo, BaseBuff, BaseEnemy, Bomb, Bullet, FlyingPunch, FlyingStaticWall, Laser, RandomBuff, SmallEnemy, StaticNature, Truck, Wall,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseEnemy = (function(superClass) {
  extend(BaseEnemy, superClass);

  function BaseEnemy(color, size) {
    if (color == null) {
      color = 'red';
    }
    if (size == null) {
      size = 1;
    }
    BaseEnemy.__super__.constructor.call(this, color, size);
    this.speed = 5;
    this.health = 1;
    this.points = 1;
    this.mesh.rotation.y = Math.PI;
  }

  BaseEnemy.prototype.tick = function(tpf) {
    this.mesh.translateZ(this.speed * tpf);
    return this.releaseIfPassed();
  };

  BaseEnemy.prototype.setStartPosition = function() {
    this.health = 1;
    return this.setPosition({
      x: Helper.random(-Config.mapLeft, Config.mapLeft),
      y: 0,
      z: Config.mapTop
    });
  };

  BaseEnemy.prototype.getPoints = function() {
    return this.points * Config.createBonus;
  };

  return BaseEnemy;

})(Box);

FlyingPunch = (function(superClass) {
  extend(FlyingPunch, superClass);

  function FlyingPunch() {
    FlyingPunch.__super__.constructor.call(this);
    this.setModel('pew-hawk');
  }

  return FlyingPunch;

})(BaseEnemy);

SmallEnemy = (function(superClass) {
  extend(SmallEnemy, superClass);

  function SmallEnemy() {
    this.id = Helper.guid();
    this.speed = 5;
    this.health = 1;
    this.points = 1;
    this.weapons = Config.weapons.toCyclicArray();
    this.moving = false;
    this.speed = 5;
    this.lastModel = void 0;
    this.mesh = new THREE.Object3D();
    this.model = Helper.plane({
      width: 0.25,
      height: 1,
      map: 'bullet-red'
    });
    this.model.material.transparent = true;
    this.model.rotation.x = Math.PI / 2;
    this.mesh.add(this.model);
    this.mesh.rotation.x = Math.PI;
    this.collisionRadius = 0.5;
  }

  return SmallEnemy;

})(BaseEnemy);

Truck = (function(superClass) {
  extend(Truck, superClass);

  function Truck() {
    Truck.__super__.constructor.call(this, 'pink');
    this.points = 2;
    this.setModel('pew-pidgeon');
  }

  Truck.prototype.tick = function(tpf) {
    this.goingLeft = this.mesh.rotation.y === Math.PI / 2;
    this.mesh.translateZ(this.getSpeed() * tpf);
    this.model.rotation.z -= this.speed * tpf;
    return this.releaseIfPassed();
  };

  Truck.prototype.getSpeed = function() {
    if (this.goingLeft && this.mesh.position.x < -Config.mapLeft - 0.5) {
      return this.speed / 4;
    }
    if (!this.goingLeft && this.mesh.position.x > Config.mapLeft + 0.5) {
      return this.speed / 4;
    }
    return this.speed;
  };

  Truck.prototype.setStartPosition = function() {
    var modifier;
    this.health = 1;
    modifier = Math.random() < 0.5 ? 1 : -1;
    this.model.rotation.z = 0;
    this.mesh.rotation.y = -Math.PI / 2 * modifier;
    return this.setPosition({
      x: (Config.mapLeft + 2) * modifier,
      y: 0,
      z: Helper.random(Config.mapTop - 1, Config.mapBottom)
    });
  };

  Truck.prototype.releaseIfPassed = function() {
    if (this.mesh.position.x < -Config.mapLeft - 4 || this.mesh.position.x > Config.mapLeft + 4) {
      return PoolManager.release(this, {
        skipExplosion: true
      });
    }
  };

  return Truck;

})(BaseEnemy);

StaticNature = (function(superClass) {
  extend(StaticNature, superClass);

  function StaticNature() {
    StaticNature.__super__.constructor.call(this, 'purple');
    this.speed = 1;
    this.invincible = true;
    this.setModel('pew-asteroid');
  }

  StaticNature.prototype.tick = function(tpf) {
    StaticNature.__super__.tick.call(this, tpf);
    return this.model.rotation.x -= tpf;
  };

  return StaticNature;

})(BaseEnemy);

Wall = (function(superClass) {
  extend(Wall, superClass);

  function Wall() {
    var extra;
    Wall.__super__.constructor.call(this, 'purple');
    this.speed = 1;
    this.invincible = true;
    this.width = 3;
    extra = Helper.cube({
      size: 1,
      material: 'MeshLambertMaterial',
      color: 'purple'
    });
    extra.position.x = 1;
    this.model.add(extra);
    extra = Helper.cube({
      size: 1,
      material: 'MeshLambertMaterial',
      color: 'purple'
    });
    extra.position.x = -1;
    this.model.add(extra);
  }

  Wall.prototype.tick = function(tpf) {
    return Wall.__super__.tick.call(this, tpf);
  };

  Wall.prototype.collidesWith = function(enemy) {
    var center, left, leftPos, right, rightPos;
    center = Helper.distanceTo(enemy.mesh.position, this.mesh.position) < this.collisionRadius;
    if (center) {
      return true;
    }
    leftPos = this.mesh.position.clone();
    leftPos.x += 1;
    left = Helper.distanceTo(enemy.mesh.position, leftPos) < this.collisionRadius;
    if (left) {
      return true;
    }
    rightPos = this.mesh.position.clone();
    rightPos.x -= 1;
    right = Helper.distanceTo(enemy.mesh.position, rightPos) < this.collisionRadius;
    return right;
  };

  return Wall;

})(BaseEnemy);

FlyingStaticWall = (function(superClass) {
  extend(FlyingStaticWall, superClass);

  function FlyingStaticWall() {
    FlyingStaticWall.__super__.constructor.call(this, 'yellow');
    this.speed = 2;
    this.health = 3;
    this.points = 3;
    this.shootRate = 3;
    this.shootAmount = 0;
    this.moveRate = 6 + Helper.random(0, 4);
    this.moveAmount = 0;
    this.setModel('pew-dread');
  }

  FlyingStaticWall.prototype.setStartPosition = function() {
    this.health = 3;
    this.shootAmount = 0;
    this.moveAmount = 0;
    this.setTarget({
      x: Helper.random(-Config.mapLeft, Config.mapLeft),
      y: 0,
      z: Helper.random(Config.mapTop - 2, -4)
    });
    return this.setPosition({
      x: Helper.random(-Config.mapLeft, Config.mapLeft),
      y: 0,
      z: Config.mapTop
    });
  };

  FlyingStaticWall.prototype.tick = function(tpf) {
    this.move(tpf);
    this.rotate(tpf);
    this.shootAmount += tpf;
    this.moveAmount += tpf;
    if (this.shootAmount > this.shootRate) {
      this.shootAmount -= this.shootRate;
      PoolManager.spawn(SmallEnemy, {
        src: this
      });
    }
    if (this.moveAmount > this.moveRate) {
      this.moveAmount -= this.moveRate;
      return this.setTarget({
        x: Helper.random(-Config.mapLeft, Config.mapLeft),
        y: 0,
        z: Helper.random(Config.mapTop - 2, -4)
      });
    }
  };

  return FlyingStaticWall;

})(BaseEnemy);

BaseBuff = (function(superClass) {
  extend(BaseBuff, superClass);

  function BaseBuff(color, size) {
    if (color == null) {
      color = 'orange';
    }
    if (size == null) {
      size = 1;
    }
    BaseBuff.__super__.constructor.call(this, color, size);
    this.speed = 3;
    this.setModel('pew-buff');
    this.wiggle = false;
    this.scene = SceneManager.currentScene();
    this.points = 5;
  }

  BaseBuff.prototype.tick = function(tpf) {
    var growMod;
    BaseBuff.__super__.tick.call(this, tpf);
    growMod = 0.1;
    if (this.wiggle) {
      this.model.rotation.z += this.speed * tpf * growMod;
      this.model.rotation.y += this.speed * tpf * growMod;
      if (this.model.rotation.z > 0.2) {
        return this.wiggle = false;
      }
    } else {
      this.model.rotation.z -= this.speed * tpf * growMod;
      this.model.rotation.y -= this.speed * tpf * growMod;
      if (this.model.rotation.z < -0.2) {
        return this.wiggle = true;
      }
    }
  };

  BaseBuff.prototype.buffIt = function() {
    var buffs;
    this.scene.level.addPoints(this.getPoints());
    buffs = [66, 190, 77];
    if (!this.scene.shootTicker.isAtMinimum()) {
      buffs.push(75);
    }
    if (!this.scene.enemyTicker.isAtMinimum()) {
      buffs.push(70);
    }
    if (!this.scene.chicken.isLastWeapon()) {
      buffs.push(72);
    }
    return this.scene.doKeyboardEvent({
      type: 'keyup',
      which: buffs.shuffle().first()
    });
  };

  return BaseBuff;

})(BaseEnemy);

RandomBuff = (function(superClass) {
  extend(RandomBuff, superClass);

  function RandomBuff() {
    return RandomBuff.__super__.constructor.apply(this, arguments);
  }

  return RandomBuff;

})(BaseBuff);

BaseAmmo = (function(superClass) {
  extend(BaseAmmo, superClass);

  function BaseAmmo(color, size) {
    if (size == null) {
      size = 1;
    }
    this.id = Helper.guid();
    this.speed = 4;
    this.collisionRadius = 1;
    this.mesh = new THREE.Object3D();
    this.model = Helper.plane({
      width: 0.25,
      height: 0.75,
      map: 'bullet-green'
    });
    this.model.material.transparent = true;
    this.model.rotation.x = Math.PI / 2;
    this.mesh.add(this.model);
  }

  BaseAmmo.prototype.tick = function(tpf) {
    this.mesh.translateZ(this.speed * tpf);
    return this.releaseIfPassed();
  };

  BaseAmmo.prototype.setSkin = function(key) {
    var tex;
    tex = TextureManager.get().items[key];
    if (tex == null) {
      throw new Error('texture not loaded');
    }
    return this.model.material.map = tex;
  };

  return BaseAmmo;

})(Box);

Bullet = (function(superClass) {
  extend(Bullet, superClass);

  function Bullet(color) {
    Bullet.__super__.constructor.call(this, 'yellow', 0.25);
    this.speed = 10;
    this.collisionRadius = 0.5;
  }

  return Bullet;

})(BaseAmmo);

Laser = (function(superClass) {
  extend(Laser, superClass);

  function Laser(color) {
    Laser.__super__.constructor.call(this, 'yellow', 0.25);
    this.speed = 10;
    this.collisionRadius = 0.5;
    this.setSkin('bullet-yellow');
  }

  return Laser;

})(BaseAmmo);

Bomb = (function(superClass) {
  extend(Bomb, superClass);

  function Bomb(color) {
    Bomb.__super__.constructor.call(this, 'yellow', 0.25);
    this.speed = 10;
    this.collisionRadius = 0.5;
    this.setSkin('bullet-cyan');
  }

  return Bomb;

})(BaseAmmo);
