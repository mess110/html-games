// Generated by CoffeeScript 1.4.0
var Level2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Level2 = (function(_super) {

  __extends(Level2, _super);

  function Level2() {
    var door;
    Level2.__super__.constructor.call(this);
    this.player.say(":|");
    this.ground = new Ground();
    this.scene.add(this.ground.mesh);
    door = new Door("xD");
    door.mesh.position.set(-1, 0, -2);
    door.mesh.rotation.set(0, 1, -Math.PI / 2 - 0.2);
    this.scene.add(door.mesh);
    door = new Door("xD");
    door.mesh.position.set(-0.8, 0, -1.7);
    door.mesh.rotation.set(-1, 0.5, -Math.PI / 2);
    this.scene.add(door.mesh);
    door = new Door("xD");
    door.mesh.position.set(1, 0, -2);
    door.mesh.rotation.set(-0.7, 0, -Math.PI / 2 - 0.5);
    this.scene.add(door.mesh);
    this.door = new Door("door");
    this.door.mesh.position.set(0, 0.2, -2);
    this.scene.add(this.door.mesh);
    this.back = new Door("back");
    this.back.mesh.position.set(-1.2, 0.2, 2.2);
    this.scene.add(this.back.mesh);
    this.addSpotlight(0, 2.5, 2);
  }

  Level2.prototype.tick = function(delta, amount) {
    Level2.__super__.tick.call(this, delta, amount);
    if (keyboard.pressed("space")) {
      if (this.player.mesh.position.distanceTo(this.back.mesh.position) < 0.3) {
        location.reload();
      }
      if (this.player.mesh.position.distanceTo(this.door.mesh.position) < 0.3) {
        return SceneManager.get().setScene(3);
      }
    }
  };

  return Level2;

})(BaseLevel);
