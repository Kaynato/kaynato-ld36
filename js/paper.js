// Generated by CoffeeScript 1.10.0
var Cursor, Game, Layers, Menu, Scene, Stage, Timers, Visuals, actionKey, calculated, contextTransition, generate, onFrame, onKeyDown, returnKey, setting,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Array.prototype.remove = function(o) {
  if (this.indexOf(o) >= 0) {
    return this.splice(this.indexOf(o), 1);
  } else {
    return console.error("Element not in array!");
  }
};

Math.randInt = function(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

window.GameContext = 'menu';

window.time = 0;

setting = {
  game: {
    height: 480,
    width: 640,
    gridInterval: 20,
    gridColor: 'silver',
    gridWidth: 1,
    cursorColor: new Color(0.9, 0.9, 0.2, 0.4),
    crossRadius: 4,
    crossColor: 'black',
    crossWidth: 0.8
  },
  menu: {
    xpos: 620,
    xSelectOffset: 30,
    ypos: 240,
    yint: 20,
    textColor: 'black',
    fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    justification: 'right',
    fontSize: 20
  },
  textBox: {
    loadPause: .2,
    letterPause: .05,
    arrowPause: .2,
    jitterSpeed: .1,
    berth: 30,
    jitter: 3,
    height: 120,
    fillColor: 'silver',
    strokeColor: 'grey',
    faceXOffset: 20,
    faceHeight: 176,
    textOffset: [20, 20],
    fontSize: 20
  }
};

calculated = {
  facePos: (function() {
    return [78 + setting.textBox.berth + setting.textBox.faceXOffset, 88 + setting.game.height - setting.textBox.berth - setting.textBox.height - setting.textBox.faceHeight];
  })(),
  resolution: (function() {
    var R;
    R = [Math.floor(setting.game.width / setting.game.gridInterval), Math.floor(setting.game.height / setting.game.gridInterval)];
    console.log("Grid has resolution " + R[0] + ", " + R[1] + ".");
    return R;
  })()
};

Timers = {
  list: [],
  add: function(timer) {
    return this.list.push(timer);
  },
  remove: function(name) {
    return this.list.forEach(function(x, i, a) {
      if (x.name === name) {
        return a.splice(i, 1);
      }
    });
  }
};

contextTransition = function(newContext) {
  return window.GameContext = newContext;
};

Layers = {
  backlight: new Layer(),
  background: new Layer(),
  grid: new Layer(),
  backWall: new Layer(),
  holes: new Layer(),
  cover: new Layer(),
  liquid: new Layer(),
  construct: new Layer(),
  rope: new Layer(),
  mechanism: new Layer(),
  cursor: new Layer(),
  textBox: new Layer(),
  text: new Layer(),
  faces: new Layer(),
  overlay: new Layer()
};

Layers.background.activate();

generate = {
  raster: function(id, pos, visible) {
    var r;
    r = new Raster(id);
    r.position = pos;
    r.visible = visible;
    return r;
  },
  menuText: function(yoffset, content) {
    var preselect, xpos;
    xpos = setting.menu.xpos;
    preselect = yoffset === Menu.cursor;
    if (preselect) {
      xpos -= setting.menu.xSelectOffset;
    }
    return new PointText({
      position: [xpos, setting.menu.ypos + yoffset * setting.menu.yint],
      fontFamily: setting.menu.fontFamily,
      justification: setting.menu.justification,
      fontSize: setting.menu.fontSize,
      textColor: setting.menu.textColor,
      content: content
    });
  },
  timer: function(name, seconds, event, repeat) {
    var timer;
    if (repeat == null) {
      repeat = false;
    }
    timer = {
      name: name,
      target: window.time + seconds,
      interval: seconds,
      event: event,
      repeat: repeat
    };
    console.log("Created timer " + timer.name + " @" + window.time + " > " + seconds);
    Timers.add(timer);
  }
};

Visuals = {
  backlight: (function() {
    var light;
    Layers.backlight.activate();
    light = new Path([[0, 0], [setting.game.width, 0], [setting.game.width, setting.game.height], [0, setting.game.height]]);
    light.fillColor = 'white';
    return light;
  })(),
  menubg: (function() {
    Layers.background.activate();
    return generate.raster('menubg', view.center, true);
  })(),
  backboard: (function() {
    var B;
    Layers.background.activate();
    B = generate.raster('backboard', view.center, true);
    B.visible = false;
    return B;
  })(),
  game: {
    grid: (function() {
      var j, k, out, ref, ref1, ref2, ref3, x, y;
      Layers.grid.activate();
      out = [];
      for (x = j = 0, ref = setting.game.width, ref1 = setting.game.gridInterval; ref1 > 0 ? j <= ref : j >= ref; x = j += ref1) {
        out.push(new Path({
          segments: [[x, 0], [x, setting.game.height]],
          strokeColor: setting.game.gridColor,
          strokeWidth: setting.game.gridWidth
        }));
      }
      for (y = k = 0, ref2 = setting.game.height, ref3 = setting.game.gridInterval; ref3 > 0 ? k <= ref2 : k >= ref2; y = k += ref3) {
        out.push(new Path({
          segments: [[0, y], [setting.game.width, y]],
          strokeColor: setting.game.gridColor,
          strokeWidth: setting.game.gridWidth
        }));
      }
      Layers.grid.visible = false;
      return out;
    })()
  },
  cursor: (function() {
    var cursor;
    Layers.cursor.activate();
    Layers.cursor.visible = false;
    cursor = [
      new Path({
        segments: [[0, 0], [setting.game.gridInterval, 0], [setting.game.gridInterval, setting.game.gridInterval], [0, setting.game.gridInterval]],
        fillColor: setting.game.cursorColor
      }), new Path({
        segments: [[setting.game.gridInterval / 2 + setting.game.crossRadius, setting.game.gridInterval / 2], [setting.game.gridInterval / 2 - setting.game.crossRadius, setting.game.gridInterval / 2]],
        strokeColor: setting.game.crossColor,
        strokeWidth: setting.game.crossWidth
      }), new Path({
        segments: [[setting.game.gridInterval / 2, setting.game.gridInterval / 2 + setting.game.crossRadius], [setting.game.gridInterval / 2, setting.game.gridInterval / 2 - setting.game.crossRadius]],
        strokeColor: setting.game.crossColor,
        strokeWidth: setting.game.crossWidth
      })
    ];
    Layers.cursor.position = [(Math.floor(setting.game.gridInterval * calculated.resolution[0] / 2)) + (Math.floor(setting.game.gridInterval / 2)), (Math.floor(setting.game.gridInterval * calculated.resolution[1] / 2)) + (Math.floor(setting.game.gridInterval / 2))];
    console.log("Cursor initialized at " + Layers.cursor.position);
    return cursor;
  })(),
  faces: (function() {
    Layers.faces.activate();
    return [generate.raster('face1', calculated.facePos, false), generate.raster('face2', calculated.facePos, false), generate.raster('face3', calculated.facePos, false), generate.raster('face4', calculated.facePos, false), generate.raster('face5', calculated.facePos, false)];
  })(),
  textBox: (function() {
    var anchors, box;
    Layers.textBox.activate();
    anchors = [[setting.textBox.berth, setting.game.height - setting.textBox.berth - setting.textBox.height], [setting.game.width - setting.textBox.berth, setting.game.height - setting.textBox.berth - setting.textBox.height], [setting.game.width - setting.textBox.berth, setting.game.height - setting.textBox.berth], [setting.textBox.berth, setting.game.height - setting.textBox.berth]];
    box = new Path(anchors);
    box.anchors = anchors;
    box.closed = true;
    box.fillColor = setting.textBox.fillColor;
    box.strokeColor = setting.textBox.strokeColor;
    box.visible = false;
    box.queue = "";
    box.char = 0;
    box.writing = false;
    box.pointText = (function() {
      Layers.text.activate();
      return new PointText({
        position: [anchors[0][0] + setting.textBox.textOffset[0], anchors[0][1] + setting.textBox.textOffset[1]],
        justification: 'left',
        fontSize: setting.textBox.fontSize,
        textColor: 'white'
      });
    })();
    box.reset = function() {
      this.char = 0;
      this.queue = "";
      return this.pointText.content = "";
    };
    box.type = function() {
      if (this.char < this.queue.length) {
        this.pointText.content += this.queue[this.char];
        this.char++;
        return true;
      } else {
        this.writing = false;
        return false;
      }
    };
    box.skip = function() {
      this.char = this.queue.length;
      this.pointText.content = this.queue;
      this.writing = false;
      return false;
    };
    box.jitter = function() {
      if (Visuals.textBox.visible) {
        return generate.timer("textBoxJitter", setting.textBox.jitterSpeed, (function() {
          Visuals.textBox.segments.forEach(function(seg, i, a) {
            seg.point.x = Visuals.textBox.anchors[i][0] + Math.randInt(-setting.textBox.jitter, setting.textBox.jitter);
            seg.point.y = Visuals.textBox.anchors[i][1] + Math.randInt(-setting.textBox.jitter, setting.textBox.jitter);
          });
        }), true);
      }
    };
    box.calm = function() {
      return Timers.remove("textBoxJitter");
    };
    return box;
  })()
};

Menu = {
  cursor: 1,
  err: function() {
    return console.log("Menu function not supported.");
  },
  start: function() {
    var j, len, option, ref;
    contextTransition('scene');
    Visuals.menubg.visible = false;
    ref = Menu.options;
    for (j = 0, len = ref.length; j < len; j++) {
      option = ref[j];
      option.visible = false;
    }
    return Scene.set(Scene.s1);
  },
  "continue": function() {
    return this.err();
  },
  load: function() {
    return this.err();
  },
  "export": function() {
    return this.err();
  },
  settings: function() {
    return this.err();
  },
  sandbox: function() {
    return this.err();
  }
};

Menu.m_start = generate.menuText(0, "NEW");

Menu.m_continue = generate.menuText(1, "CONTINUE");

Menu.m_load = generate.menuText(2, "LOAD FROM FILE");

Menu.m_export = generate.menuText(3, "SAVE TO FILE");

Menu.m_settings = generate.menuText(4, "SETTINGS");

Menu.m_sandbox = generate.menuText(5, "SANDBOX");

Menu.options = [Menu.m_start, Menu.m_continue, Menu.m_load, Menu.m_export, Menu.m_settings, Menu.m_sandbox];

Menu.select = function(selection) {
  switch (selection) {
    case Menu.m_start:
      return this.start();
    case Menu.m_continue:
      return this["continue"]();
    case Menu.m_load:
      return this.load();
    case Menu.m_export:
      return this["export"]();
    case Menu.m_settings:
      return this.settings();
    case Menu.m_sandbox:
      return this.sandbox();
  }
};

Game = {
  info: {
    money: 100,
    inventory: {
      wall: -1,
      hole: -1,
      rope: -2,
      sluice: -2,
      wedge: -2,
      wheel: -2
    }
  },
  activeStage: null,
  activate: function() {
    Layers.grid.visible = true;
    Layers.cursor.visible = true;
    return Visuals.backboard.visible = true;
  },
  deactivate: function() {
    Layers.grid.visible = false;
    Layers.cursor.visible = false;
    return Visuals.backboard.visible = false;
  },
  set: function(stage) {
    return this.activeStage = stage;
  }
};

Stage = {
  testing: 0
};

Cursor = {
  bounds: calculated.resolution,
  coordinate: [Math.floor((Math.floor(setting.game.width / setting.game.gridInterval)) / 2), Math.floor((Math.floor(setting.game.height / setting.game.gridInterval)) / 2)],
  move: function(x, y) {
    this.coordinate[0] += x;
    if (this.coordinate[0] >= this.bounds[0]) {
      this.coordinate[0] %= this.bounds[0];
    }
    if (this.coordinate[0] < 0) {
      this.coordinate[0] += this.bounds[0];
    }
    this.coordinate[1] += y;
    if (this.coordinate[1] >= this.bounds[1]) {
      this.coordinate[1] %= this.bounds[1];
    }
    if (this.coordinate[1] < 0) {
      this.coordinate[1] += this.bounds[1];
    }
    console.log("Moved cursor to position " + this.coordinate);
    Layers.cursor.position.x = setting.game.gridInterval * this.coordinate[0] + (Math.floor(setting.game.gridInterval / 2));
    return Layers.cursor.position.y = setting.game.gridInterval * this.coordinate[1] + (Math.floor(setting.game.gridInterval / 2));
  },
  up: function() {
    return this.move(0, -1);
  },
  down: function() {
    return this.move(0, 1);
  },
  left: function() {
    return this.move(-1, 0);
  },
  right: function() {
    return this.move(1, 0);
  },
  select: function() {
    return 0;
  },
  enabled: false
};

Scene = {
  write: function(char, text) {
    Visuals.textBox.visible = true;
    Visuals.textBox.queue = text;
    if (!Visuals.textBox.writing) {
      Visuals.textBox.writing = true;
      generate.timer("startWriting", setting.textBox.loadPause, (function() {
        return generate.timer("writing", setting.textBox.letterPause, (function() {
          if (!Visuals.textBox.type()) {
            return Timers.remove("writing");
          }
        }), true);
      }));
    }
    Visuals.faces.forEach(function(x, i, a) {
      if (i === char) {
        x.visible = true;
      } else {
        x.visible = false;
      }
    });
  },
  set: function(scene) {
    var position;
    this.activeScene = scene;
    position = 0;
    Visuals.textBox.visible["true"];
    return this.read();
  },
  activeScene: null,
  activeFace: -1,
  position: 0,
  s1: [
    [0, "HELLO WORLD."], [1, "Yep, have fun."], [0, "ACKNOWLEDGED."], function() {
      Game.set(Stage.testing);
      Game.activate();
      return Scene.advance();
    }, [0, "This is the canvas on which shall be created..."], function() {
      Visuals.textBox.jitter();
      return Scene.advance();
    }, [0, "The greatest invention known to the world!"], function() {
      Cursor.enabled = true;
      Visuals.textBox.calm();
      return Scene.advance();
    }, [0, "First, use the arrow keys to move the cursor."]
  ],
  end: function() {
    console.log("Scene has ended.");
    Visuals.textBox.visible = false;
    return Visuals.faces.forEach(function(x, i, a) {
      x.visible = false;
    });
  },
  read: function() {
    if (this.activeScene[this.position] instanceof Array) {
      this.write(this.activeScene[this.position][0], this.activeScene[this.position][1]);
      return true;
    } else if (this.activeScene[this.position] instanceof Function) {
      this.activeScene[this.position]();
      return false;
    }
  },
  advance: function() {
    console.log("Textbox is " + (!Visuals.textBox.writing ? 'not' : '') + " writing.");
    if (this.activeScene != null) {
      if (!Visuals.textBox.writing) {
        Visuals.textBox.reset();
        this.position++;
        if (this.position < this.activeScene.length) {
          return this.read();
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
};

actionKey = ['enter', 'space', 'z'];

returnKey = ['escape', 'x'];

onKeyDown = function(event) {
  var ref, ref1, ref2;
  switch (window.GameContext) {
    case 'menu':
      if (event.key === 'down' || event.key === 'up') {
        Menu.options[Menu.cursor].position.x += setting.menu.xSelectOffset;
        if (event.key === 'down') {
          Menu.cursor++;
        } else {
          Menu.cursor--;
        }
        if (Menu.cursor >= Menu.options.length) {
          Menu.cursor %= Menu.options.length;
        }
        if (Menu.cursor < 0) {
          Menu.cursor += Menu.options.length;
        }
        Menu.options[Menu.cursor].position.x -= setting.menu.xSelectOffset;
      }
      if (ref = event.key, indexOf.call(actionKey, ref) >= 0) {
        Menu.select(Menu.options[Menu.cursor]);
      }
      break;
    case 'scene':
      if (ref1 = event.key, indexOf.call(actionKey, ref1) >= 0) {
        Scene.advance();
      }
      if (ref2 = event.key, indexOf.call(returnKey, ref2) >= 0) {
        Visuals.textBox.skip();
      }
  }
  if (Cursor.enabled) {
    if (event.key === 'up') {
      Cursor.up();
    }
    if (event.key === 'down') {
      Cursor.down();
    }
    if (event.key === 'left') {
      Cursor.left();
    }
    if (event.key === 'right') {
      return Cursor.right();
    }
  }
};

onFrame = function(event) {
  window.time = event.time;
  if (Timers.list.length !== 0) {
    return Timers.list.forEach(function(x, i, a) {
      while (x.target <= event.time && x.target !== -1) {
        x.event();
        if (x.repeat) {
          x.target += x.interval;
        } else {
          x.target = -1;
          a.splice(i, 1);
        }
      }
    });
  }
};
