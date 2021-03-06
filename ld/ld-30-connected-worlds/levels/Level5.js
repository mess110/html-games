// Generated by CoffeeScript 1.4.0
var Level5,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Level5 = (function(_super) {

  __extends(Level5, _super);

  function Level5() {
    Level5.__super__.constructor.call(this);
    this.player.say(":D");
    this.player.mesh.position.set(0, 2, 0);
    this.player.canMove = false;
    this.player.jumping = true;
    this.ground = new Ground();
    this.scene.add(this.ground.mesh);
    this.counter = new Door("0");
    this.counter.mesh.position.set(0, 0.2, -1);
    this.scene.add(this.counter.mesh);
    this.addSpotlight(0, 2.5, 2);
  }

  Level5.prototype.tick = function(delta, amount) {
    Level5.__super__.tick.call(this, delta, amount);
    if (this.player.mesh.position.y > this.player.baseLevel) {
      if (this.player.touchedGround === false) {
        this.player.mesh.position.y -= 2 * delta;
      }
    } else {
      this.player.touchedGround = true;
      this.player.canMove = true;
    }
    this.counter.say(this.player.jumpCount.toString());
    if (this.counter.mesh.position.distanceTo(this.player.mesh.position) > 2) {
      this.player.jumpCount = 0;
    }
    if (this.player.jumpCount >= 3) {
      return SceneManager.get().setScene(6);
    }
  };

  return Level5;

})(BaseLevel);
