class GameMaker {
  constructor(options = {}) {
    this.options = options;

    if (this.options.size == undefined || this.options.size == null) {
      throw new Error('unknown player size');
    }
    if (this.options.size > 4) {
      throw new Error('too many players');
    }
    if (this.options.size < 2) {
      throw new Error('requires at least 2 players');
    }

    this.types = ['button', 'switch', 'radio', 'rating'];

    this.buttons = shuffle([
      { width: 'col-xs-4', label: 'Eject CD', type: 'button' },
      { width: 'col-xs-4', label: 'Deploy', type: 'button' },
      { width: 'col-xs-4', label: 'Gather Requirements', type: 'button' },
      { width: 'col-xs-4', label: 'Cleanup Issues', type: 'button' },
      { width: 'col-xs-4', label: 'Start Hackathon', type: 'button' }
    ]);

    this.switches = shuffle([
      { width: 'col-xs-4', label: 'A/B testing', type: 'switch', output: false },
      { width: 'col-xs-4', label: 'Continuous Deployment', type: 'switch', output: false },
      { width: 'col-xs-4', label: 'Debugger', type: 'switch', output: false },
      { width: 'col-xs-4', label: 'Thread safety', type: 'switch', output: false },
      { width: 'col-xs-4', label: 'Party mode', type: 'switch', output: false }
    ]);

    this.radios = shuffle([
      { width: 'col-xs-8', label: 'Color', labels: ['rgb', 'hsv', 'hex'], output: 'rgb', type: 'radio' },
      { width: 'col-xs-8', label: 'Pattern', labels: ['singleton', 'observer', 'factory'], output: 'singleton', type: 'radio' },
      { width: 'col-xs-8', label: 'License', labels: ['MIT', 'GPL', 'Public Domain'], output: 'MIT', type: 'radio' },
      { width: 'col-xs-8', label: 'Latency', labels: ['low', 'average', 'high'], output: 'low', type: 'radio'  },
      { width: 'col-xs-8', label: 'Engine', labels: ['2wd', '4wd', 'sonic', 'supersonic'], output: '2wd', type: 'radio' }
    ]);

    this.ratings = shuffle([
      { width: 'col-xs-8', label: 'CPU', max: 8, output: 0, type: 'rating' },
      { width: 'col-xs-8', label: 'Network Interface', max: 8, output: 0, type: 'rating'  },
      { width: 'col-xs-8', label: 'Virtual Machines', max: 8, output: 0, type: 'rating' },
      { width: 'col-xs-8', label: 'Port', max: 8, output: 0, type: 'rating' },
      { width: 'col-xs-8', label: 'Encryption', max: 8, output: 0, type: 'rating' }
    ]);

    this.commands = [];
    for (var i = 0, l = this.options.size; i < l; i++) {
      for (var j = 0, k = commandsPerPlayer; j < k; j++) {
        var randomElement = this.random(this.types);
        // TODO: ternary operator
        if (randomElement == 'switch')
          randomElement = 'switches'
        else
          randomElement += 's'
        var visibleElements = this[randomElement].slice(0, this.options.size);
        var visibleElement = this.random(visibleElements, [this[randomElement][i]]);

        if (visibleElement.type == 'switch') {
          visibleElement.output = !visibleElement.output;
        }
        if (visibleElement.type == 'radio') {
          visibleElement.output = this.random(visibleElement.labels, [visibleElement.output]);
        }
        if (visibleElement.type == 'rating') {
          var original = visibleElement.output;
          visibleElement.output = getRandomInt(0, visibleElement.max);
          if (original == visibleElement.output) {
            visibleElement.output -= 1;
            if (visibleElement.output < 0) {
              visibleElement.output = visibleElement.max - 1;
            }
          }
        }
        this.commands.push(JSON.parse(JSON.stringify(visibleElement)));
      }
    }
    this.resetElements();
  }

  resetElements() {
    for (var i = 0, l = this.radios.length; i < l; i++) {
      var v = this.radios[i];
      v.output = v.labels[0];
    }

    for (var i = 0, l = this.ratings.length; i < l; i++) {
      var v = this.ratings[i];
      v.output = 0;
    }

    for (var i = 0, l = this.switches.length; i < l; i++) {
      var v = this.switches[i];
      v.output = false;
    }
  }

  toJson() {
    return {
      buttons: this.buttons,
      switches: this.switches,
      radios: this.radios,
      ratings: this.ratings,
      commands: this.commands
    }
  }

  fromJson(json) {
    this.buttons = json.buttons;
    this.switches = json.switches;
    this.radios = json.radios;
    this.ratings = json.ratings;
    this.commands = json.commands;
  }

  random(items, except=[]) {
    var tmpArray = [];
    for (var i = 0, l = items.length; i < l; i++) {
      var v = items[i];
      var add = true;
      for (var j = 0, k = except.length; j < k; j++) {
        var vv = except[j];
        if (JSON.stringify(v) === JSON.stringify(vv) ) {
          add = false;
        }
      }
      if (add) {
        tmpArray.push(v);
      }
    }
    return tmpArray[Math.floor(Math.random()*tmpArray.length)];
  }
}

