// Generated by CoffeeScript 1.12.7
var Mole,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Mole = (function(superClass) {
  extend(Mole, superClass);

  function Mole(moleId) {
    var light, stars;
    Mole.__super__.constructor.call(this);
    this.moleId = moleId;
    this.hittable = false;
    this.wasHit = false;
    this.mesh = new THREE.Object3D();
    this.mesh.moleId = moleId;
    this.mole = JsonModelManager.clone('mole');
    this.mole.moleId = moleId;
    this.mole.position.y = -3;
    this.rumble = JsonModelManager.clone('rumble');
    this.rumble.rotation.y = Helper.random(0, Math.PI);
    this.rumble.moleId = moleId;
    this.stars = JsonModelManager.clone('stars');
    this.stars.rotation.x = Math.PI / 2;
    this.stars.position.z = -1.5;
    stars = this.stars;
    this.stars.animations[2].play();
    this.mole.traverse(function(object) {
      if (object instanceof THREE.Bone && object.name === 'Head') {
        return object.add(stars);
      }
    });
    this.hideStars();
    light = Helper.pointLight({
      distance: 10
    });
    light.position.set(0, 5, 0);
    Hodler.add("light" + moleId, light);
    this.mesh.add(light);
    this.mesh.add(this.rumble);
    this.mesh.add(this.mole);
  }

  Mole.prototype.stopAnimations = function() {
    var animation, i, len, ref, results;
    ref = this.mole.animations;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      animation = ref[i];
      if (animation.isRunning()) {
        results.push(animation.stop());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Mole.prototype.animate = function(which) {
    var animationName, possibleHits, possibleTaunts;
    this.stopAnimations();
    possibleTaunts = ['taunt1', 'taunt2', 'taunt3'];
    possibleHits = ['hit1'];
    if (which === 'taunt') {
      animationName = possibleTaunts.shuffle().first();
    }
    if (which === 'hit') {
      animationName = possibleHits.shuffle().first();
    }
    return this.mole.animations.filter(function(e) {
      return e._clip.name === animationName;
    }).first().play();
  };

  Mole.prototype.hideStars = function() {
    return this.stars.traverse(function(object) {
      return object.visible = false;
    });
  };

  Mole.prototype.showStars = function() {
    return this.stars.traverse(function(object) {
      return object.visible = true;
    });
  };

  Mole.prototype.cancelNormalMove = function() {
    var duration;
    if (this.appearTween != null) {
      this.appearTween.stop();
    }
    if (this.disappearTween != null) {
      this.disappearTween.stop();
    }
    if (this.oneTO != null) {
      clearTimeout(this.oneTO);
    }
    if (this.twoTO != null) {
      clearTimeout(this.twoTO);
    }
    this.mole.position.y = 0;
    this.wasHit = true;
    duration = 500;
    return setTimeout((function(_this) {
      return function() {
        _this.disappearTween = Helper.tween({
          duration: duration,
          mesh: _this.mole,
          kind: 'Elastic',
          direction: 'Out',
          target: {
            y: -3
          }
        });
        _this.disappearTween.start();
        return _this.twoTO = setTimeout(function() {
          _this.hittable = false;
          _this.hideStars();
          return _this.wasHit = false;
        }, duration / 3);
      };
    })(this), duration);
  };

  Mole.prototype.appear = function() {
    var appearSound, duration, pos, stay;
    if (this.hittable) {
      return;
    }
    this.hittable = true;
    duration = 500;
    stay = SceneManager.currentScene().stayTime;
    this.hideStars();
    this.animate('taunt');
    pos = LoadingScene.LOADING_OPTIONS.camera.position.clone();
    pos.y -= 10;
    this.mole.lookAt(pos);
    this.appearTween = Helper.tween({
      duration: duration,
      mesh: this.mole,
      kind: 'Elastic',
      direction: 'Out',
      target: {
        y: 0
      }
    });
    this.appearTween.start();
    if (Hodler.item('gameScene').finished) {
      return;
    }
    appearSound = ['appear1', 'appear2', 'appear3'].shuffle().first();
    SoundManager.volume(appearSound, 0.2);
    SoundManager.play(appearSound);
    return this.oneTO = setTimeout((function(_this) {
      return function() {
        _this.disappearTween = Helper.tween({
          duration: duration,
          mesh: _this.mole,
          kind: 'Elastic',
          direction: 'Out',
          target: {
            y: -3
          }
        });
        _this.disappearTween.start();
        return _this.twoTO = setTimeout(function() {
          _this.hittable = false;
          return _this.hideStars();
        }, duration / 3);
      };
    })(this), duration + stay);
  };

  return Mole;

})(BaseModel);
