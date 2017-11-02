// Generated by CoffeeScript 1.12.7
var CyclicQueue, Replay;

CyclicQueue = (function() {
  function CyclicQueue(maxItems) {
    if (maxItems == null) {
      maxItems = 100;
    }
    this.items = [];
    this.maxItems = maxItems;
    this.goingDown = true;
  }

  CyclicQueue.prototype.add = function(item) {
    this.items.push(item);
    if (this.items.size() > this.maxItems) {
      return this.items.shift();
    }
  };

  CyclicQueue.prototype.get = function() {
    var amount;
    if (this.index == null) {
      this.index = this.items.size() - 1;
    } else {
      if (this.index === 0) {
        this.goingDown = false;
      }
      if (this.index === this.items.size() - 1) {
        this.goingDown = true;
      }
      amount = this.goingDown ? 5 : 1;
      if (this.goingDown) {
        this.index -= amount;
      } else {
        this.index += amount;
      }
      if (this.index < 0) {
        this.index = 0;
      }
      if (this.index > this.items.size() - 1) {
        this.index = this.items.size() - 1;
      }
    }
    return this.items[this.index];
  };

  CyclicQueue.prototype.clear = function() {
    this.items = [];
    return this.goingDown = true;
  };

  return CyclicQueue;

})();

Replay = (function() {
  function Replay() {
    this.cyclicQueue = new CyclicQueue(300);
    this.replaying = false;
    this.canSkipReplay = false;
    this.scene = SceneManager.currentScene();
  }

  Replay.prototype.getFrame = function() {
    return this.cyclicQueue.get();
  };

  Replay.prototype.getTotalReplayTime = function() {
    var z;
    z = this.cyclicQueue.items.map(function(e) {
      return e.tpf;
    });
    return z.reduce(function(t, f) {
      return t + f;
    });
  };

  Replay.prototype.saveFrame = function(tpf) {
    return this.cyclicQueue.add(this.scene.snapshot(tpf));
  };

  Replay.prototype.clear = function() {
    return this.cyclicQueue.clear();
  };

  Replay.prototype.replay = function() {
    this.scene.level.running = false;
    window['coffee-engine-dom'].style.filter = 'grayscale(100)';
    window.wasted.style.visibility = 'visible';
    window.highScore.style.visibility = 'visible';
    this.canSkipReplay = false;
    return setTimeout((function(_this) {
      return function() {
        _this.replaying = true;
        return setTimeout(function() {
          return _this.canSkipReplay = true;
        }, 1000);
      };
    })(this), 500);
  };

  return Replay;

})();
