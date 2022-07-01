
/*************************** [bundle] ****************************/
// Original file:./src/pages/Home/index.ts
/*****************************************************************/
window.__etcpack__bundleSrc__['20']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    var _dec, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

__etcpack__scope_args__=window.__etcpack__getBundle('1');
var Component=__etcpack__scope_args__.Component;
var ref=__etcpack__scope_args__.ref;

__etcpack__scope_args__=window.__etcpack__getBundle('28');
var getKeyString =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('25');
var xhtml =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('29');
var style =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('30');
var template =__etcpack__scope_args__.default;

var config = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-config");
var mac = [];

var _class = (_dec = Component({
  template: template,
  styles: [style]
}), _dec(_class2 = /*#__PURE__*/function () {
  function _class2() {
    _classCallCheck(this, _class2);

    _defineProperty(this, "ip", void 0);

    _defineProperty(this, "name", void 0);
  }

  _createClass(_class2, [{
    key: "$setup",
    value: function $setup() {
      return {
        ip: ref(['127.0.0.1']),
        name: ref(config.name)
      };
    }
  }, {
    key: "doKeydown",
    value: function doKeydown(event) {
      if (getKeyString(event) == 'enter') {
        alert('非常抱歉，好友搜索功能未开发~');
      }
    }
  }, {
    key: "quit",
    value: function quit() {
      globalThis.nodeRequire('electron').ipcRenderer.send('quit');
    }
  }, {
    key: "minimize",
    value: function minimize() {
      globalThis.nodeRequire('electron').ipcRenderer.send('minimize');
    } // 发送信息
    // target表示接收者的ip，如果是“255.255.255.255”，就是发送给所有的

  }, {
    key: "sendMsg",
    value: function sendMsg(data) {
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "255.255.255.255";
      var msg = {
        target: target,
        data: data
      };
      globalThis.nodeRequire('electron').ipcRenderer.send('send-msg', JSON.stringify(msg));
    } // 发送同步好友列表的请求

  }, {
    key: "doSync",
    value: function doSync() {
      /**
       * 同步的流程：
       * 1.先清空自己的好友列表，
       * 2、然后发送信息告诉所有人，
       * 3.收到信息的人会在自己的列表检查是否包含发送请求的人，如果不存在就加进去
       * 4.收到信息的再发送一个专门的请求告诉请求同步的自己可以被添加到列表中去
       */
      document.getElementById('address-list').innerHTML = "";
      this.sendMsg({
        type: "sync",
        name: this.name,
        mac: mac[0]
      });
    }
  }, {
    key: "isToMe",
    value: function isToMe(target) {
      // 如果是广播，接收
      if (target == '255.255.255.255') return true; // 如果和目标ip一样，接收

      for (var index = 0; index < this.ip.length; index++) {
        if (this.ip[index] == target) return true;
      }

      return false;
    }
  }, {
    key: "$mounted",
    value: function $mounted() {
      var _this = this;

      var networks = globalThis.nodeRequire('os').networkInterfaces();
      var ip = [];

      for (var typeName in networks) {
        var network = networks[typeName];

        for (var index = 0; index < network.length; index++) {
          if (network[index].family == 'IPv4' && network[index].address != '127.0.0.1') {
            ip.push(network[index].address);
            mac.push(network[index].mac);
          }
        }
      } // 启动的时候，自动触发列表同步


      this.doSync();
      this.ip = ip; // 启动事件监听主进程

      globalThis.nodeRequire('electron').ipcRenderer // 监听别的软件发送来的信息
      .on("get-msg", function (event, data) {
        var msg = JSON.parse(decodeURIComponent(data.msg));

        if (_this.isToMe(msg.target)) {
          // 如果是同步信息
          if (msg.data.type == 'sync') {
            // 如果列表中不存在，添加
            if (!document.getElementById(data.ip)) {
              var itemEl = document.createElement('div');
              itemEl.setAttribute('id', data.ip);
              itemEl.innerHTML = "\n                            <span></span>\n                            ".concat(function (_name) {
                if (_name.length > 10) {
                  return _name.substr(0, 10) + "...";
                } else {
                  return _name;
                }
              }(msg.data.name), "\n                            <i>(").concat(data.ip, ")</i>\n                            ");
              xhtml.bind(itemEl, 'click', function () {
                var _mac = msg.data.mac; // 如果已经打开了，应该恢复最前面而不是重新打开

                /**
                 * 信息都保存着主界面的sessionStorage里面
                 * 聊天界面在打开的时候，同步信息，后续有了新信息，推送给他
                 */

                globalThis.nodeRequire('electron').ipcRenderer.send('open-talker', {
                  yourip: data.ip,
                  yourname: msg.data.name,
                  mymac: mac[0],
                  myip: _this.ip,
                  yourmac: _mac
                });

                if (!config.history[_mac]) {
                  config.history[_mac] = {
                    ip: data.ip,
                    name: msg.data.name
                  };
                  globalThis.nodeRequire('electron').ipcRenderer.send('set-config', config);
                  globalThis.nodeRequire('electron').ipcRenderer.send('set-talker', {
                    mac: _mac,
                    value: []
                  });
                }
              });
              document.getElementById('address-list').appendChild(itemEl);
            } // 如果是广播，还需要反馈对方


            if (msg.target == '255.255.255.255') {
              _this.sendMsg({
                type: "sync",
                name: _this.name,
                mac: mac[0]
              }, data.ip);
            }
          } // 如果是接收到的聊天信息
          else if (msg.data.type == 'talker') {
            var _mac = msg.data.value.mac; // 把信息保存起来作为历史记录

            var content;

            if (msg.data.value.type == 'string') {
              content = msg.data.value.content;
            } // 写入磁盘保存起来


            var history = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-talker", _mac);
            history.push({
              time: new Date().valueOf(),
              content: content,
              align: "left",
              type: "string"
            });
            globalThis.nodeRequire('electron').ipcRenderer.send('set-talker', {
              mac: _mac,
              value: history
            });
          }
        }
      });
    }
  }]);

  return _class2;
}()) || _class2);

__etcpack__scope_bundle__.default=_class;
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/browser/getKeyString.js
/*****************************************************************/
window.__etcpack__bundleSrc__['28']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    /*!
 * 🌐 - 获取键盘此时按下的键的组合结果
 * https://github.com/hai2007/browser.js/blob/master/getKeyString.js
 *
 * author hai2007 < https://hai2007.gitee.io/sweethome >
 *
 * Copyright (c) 2021-present hai2007 走一步，再走一步。
 * Released under the MIT license
 */
// 字典表
var dictionary = {

    // 数字
    48: [0, ')'],
    49: [1, '!'],
    50: [2, '@'],
    51: [3, '#'],
    52: [4, '$'],
    53: [5, '%'],
    54: [6, '^'],
    55: [7, '&'],
    56: [8, '*'],
    57: [9, '('],
    96: [0, 0],
    97: 1,
    98: 2,
    99: 3,
    100: 4,
    101: 5,
    102: 6,
    103: 7,
    104: 8,
    105: 9,
    106: "*",
    107: "+",
    109: "-",
    110: ".",
    111: "/",

    // 字母
    65: ["a", "A"],
    66: ["b", "B"],
    67: ["c", "C"],
    68: ["d", "D"],
    69: ["e", "E"],
    70: ["f", "F"],
    71: ["g", "G"],
    72: ["h", "H"],
    73: ["i", "I"],
    74: ["j", "J"],
    75: ["k", "K"],
    76: ["l", "L"],
    77: ["m", "M"],
    78: ["n", "N"],
    79: ["o", "O"],
    80: ["p", "P"],
    81: ["q", "Q"],
    82: ["r", "R"],
    83: ["s", "S"],
    84: ["t", "T"],
    85: ["u", "U"],
    86: ["v", "V"],
    87: ["w", "W"],
    88: ["x", "X"],
    89: ["y", "Y"],
    90: ["z", "Z"],

    // 方向
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    33: "page up",
    34: "page down",
    35: "end",
    36: "home",

    // 控制键
    16: "shift",
    17: "ctrl",
    18: "alt",
    91: "command",
    92: "command",
    93: "command",
    224: "command",
    9: "tab",
    20: "caps lock",
    32: "spacebar",
    8: "backspace",
    13: "enter",
    27: "esc",
    46: "delete",
    45: "insert",
    144: "number lock",
    145: "scroll lock",
    12: "clear",
    19: "pause",

    // 功能键
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",

    // 余下键
    189: ["-", "_"],
    187: ["=", "+"],
    219: ["[", "{"],
    221: ["]", "}"],
    220: ["\\", "|"],
    186: [";", ":"],
    222: ["'", '"'],
    188: [",", "<"],
    190: [".", ">"],
    191: ["/", "?"],
    192: ["`", "~"]

};

// 非独立键字典
var help_key = ["shift", "ctrl", "alt"];

/**
 * 键盘按键
 * 返回键盘此时按下的键的组合结果
 */
__etcpack__scope_bundle__.default= function(event) {
    event = event || window.event;

    var keycode = event.keyCode || event.which;
    var key = dictionary[keycode] || keycode;
    if (!key) return;
    if (key.constructor !== Array) key = [key, key];

    var _key = key[0];

    var shift = event.shiftKey ? "shift+" : "",
        alt = event.altKey ? "alt+" : "",
        ctrl = event.ctrlKey ? "ctrl+" : "";

    var resultKey = "",
        preKey = ctrl + shift + alt;

    if (help_key.indexOf(key[0]) >= 0) {
        key[0] = key[1] = "";
    }

    // 判断是否按下了caps lock
    var lockPress = event.code == "Key" + event.key && !shift;

    // 只有字母（且没有按下功能Ctrl、shift或alt）区分大小写
    resultKey = (preKey + ((preKey == '' && lockPress) ? key[1] : key[0]));

    if (key[0] == "") {
        resultKey = resultKey.replace(/\+$/, '');
    }

    return resultKey == '' ? _key : resultKey;
};
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/pages/Home/index.scss
/*****************************************************************/
window.__etcpack__bundleSrc__['29']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= "\n .view{\n\nbackground-color: rgb(221, 237, 249);\n\nbackground-image: linear-gradient(rgb(221, 237, 249), white);\n\nheight: 100vh;\n\n}\n\n .view>header{\n\nposition: relative;\n\n}\n\n .view>header>h2{\n\nfont-size: 14px;\n\nline-height: 30px;\n\nbackground-image: url('./image/logo.png');\n\nbackground-size: auto 70%;\n\nbackground-repeat: no-repeat;\n\nbackground-position: 10px center;\n\npadding-left: 40px;\n\nfont-weight: 200;\n\nfont-family: cursive;\n\n}\n\n .view>header>.btn{\n\nposition: absolute;\n\nwidth: 20px;\n\nheight: 20px;\n\nbackground-position: center center;\n\ntop: 0;\n\nfont-size: 0;\n\nbackground-repeat: no-repeat;\n\ncursor: pointer;\n\n}\n\n .view>header>.btn:hover{\n\nbackground-color: rgb(202, 226, 245);\n\n}\n\n .view>header>.btn.min{\n\nbackground-image: url('./image/min.png');\n\nright: 40px;\n\n}\n\n .view>header>.btn.close{\n\nbackground-image: url('./image/close.png');\n\nright: 10px;\n\n}\n\n .view>.msg{\n\npadding: 5px 10px;\n\n}\n\n .view>.msg>div{\n\ndisplay: inline-block;\n\nvertical-align: top;\n\n}\n\n .view>.msg>div.icon{\n\nwidth: 40px;\n\nheight: 40px;\n\nborder: 1px solid white;\n\nbackground-image: url('./image/icon.jpg');\n\nbackground-position: center center;\n\nbackground-size: auto 100%;\n\nborder-radius: 5px;\n\n}\n\n .view>.msg>div.info{\n\npadding-left: 5px;\n\n}\n\n .view>.msg>div.info>input{\n\nbackground-color: transparent;\n\noutline: none;\n\nborder: none;\n\nfont-size: 14px;\n\n}\n\n .view>.msg>div.info>div{\n\nfont-size: 12px;\n\nfont-weight: 200;\n\n}\n\n .view>.search>input{\n\nheight: 24px;\n\ndisplay: block;\n\nmargin: auto;\n\nwidth: calc(100vw - 10px);\n\nline-height: 12px;\n\nborder-radius: 5px;\n\noutline: none;\n\npadding: 0 5px;\n\nfont-size: 12px;\n\nborder: none;\n\nbackground-color: rgb(255, 255, 255);\n\nbox-shadow: inset 0 0 3px 0px #b9b7b7;\n\n}\n\n .view>.list{\n\nheight: calc(100vh - 186px);\n\nbackground-color: white;\n\nmargin: 5px;\n\nborder: 1px solid rgb(77, 173, 247);\n\n}\n\n .view>.tool{\n\nheight: 70px;\n\nbackground-image: linear-gradient(white, rgb(221, 237, 249));\n\n}\n\n .view>.tool>div{\n\ndisplay: inline-block;\n\nvertical-align: top;\n\n}\n\n .view>.tool>div.sync{\n\nborder-radius: 50%;\n\nborder: 1px solid gray;\n\nwidth: 50px;\n\nheight: 50px;\n\nfont-size: 0;\n\nvertical-align: top;\n\nmargin-top: 10px;\n\nmargin-left: 10px;\n\nbackground-image: url('./image/sync.png');\n\nbackground-size: 90% auto;\n\nbackground-position: center center;\n\nbackground-repeat: no-repeat;\n\nanimation: rotateBody 3s infinite;\n\ncursor: pointer;\n\n}\n"
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/pages/Home/index.html
/*****************************************************************/
window.__etcpack__bundleSrc__['30']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= "<div class='view'>\r\n    <header>\r\n        <h2 style=\"-webkit-app-region: drag\">\r\n            来聊天吧~\r\n        </h2>\r\n        <span class=\"btn min\" style=\"-webkit-app-region: no-drag\" ui-on:click=\"minimize\">\r\n            最小化\r\n        </span>\r\n        <span class=\"btn close\" style=\"-webkit-app-region: no-drag\" ui-on:click='quit'>\r\n            关闭\r\n        </span>\r\n    </header>\r\n    <div class=\"msg\">\r\n        <div class=\"icon\"></div>\r\n        <div class=\"info\">\r\n            <input type=\"text\" ui-model=\"name\" disabled>\r\n            <div ui-bind=\"ip[0]\"></div>\r\n        </div>\r\n    </div>\r\n    <div class=\"search\">\r\n        <input type=\"text\" placeholder=\"搜索好友\" ui-on:keydown=\"doKeydown\">\r\n    </div>\r\n    <div class=\"list\" id=\"address-list\"></div>\r\n    <div class=\"tool\">\r\n        <div class=\"sync\" title=\"点击我同步好友列表\" ui-on:click=\"doSync\">\r\n            同步列表\r\n        </div>\r\n    </div>\r\n</div>\r\n"
  
    return __etcpack__scope_bundle__;
}
