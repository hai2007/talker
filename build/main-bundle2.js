
/*************************** [bundle] ****************************/
// Original file:./src/pages/Talker/index.ts
/*****************************************************************/
window.__etcpack__bundleSrc__['21']=function(){
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

__etcpack__scope_args__=window.__etcpack__getBundle('31');
var animation =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('32');
var style =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('33');
var template =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('34');
var stringToTemplate =__etcpack__scope_args__.default;

var msgEl;

var _class = (_dec = Component({
  template: template,
  styles: [style]
}), _dec(_class2 = /*#__PURE__*/function () {
  function _class2() {
    _classCallCheck(this, _class2);

    _defineProperty(this, "info", void 0);

    _defineProperty(this, "content", void 0);

    _defineProperty(this, "isSelf", void 0);
  }

  _createClass(_class2, [{
    key: "quit",
    value: function quit() {
      globalThis.nodeRequire('electron').ipcRenderer.send('quit-talker');
    }
  }, {
    key: "minimize",
    value: function minimize() {
      globalThis.nodeRequire('electron').ipcRenderer.send('minimize-talker');
    }
  }, {
    key: "doKeydown",
    value: function doKeydown(event) {
      var _this = this;

      switch (getKeyString(event)) {
        case "enter":
          {
            setTimeout(function () {
              _this.doSend();
            });
            break;
          }

        case "shift+enter":
          {
            this.content += "\n";
            break;
          }
      }
    }
  }, {
    key: "doScrollToBottom",
    value: function doScrollToBottom() {
      var msgEl = document.getElementById('msg');
      var scrollTop = msgEl.scrollTop;
      animation(function (deep) {
        msgEl.scrollTop = (msgEl.scrollHeight - scrollTop) * deep + scrollTop;
      }, 500);
    } // 发送图片

  }, {
    key: "sendImage",
    value: function sendImage(event) {
      var _this2 = this;

      var file = event.target.files[0];
      var reader = new FileReader();

      reader.onload = function () {
        var itemEl = document.createElement('div');
        itemEl.setAttribute('class', 'right item-talker');
        itemEl.innerHTML = "<span><img style='max-width:240px;padding-top:10px;' src=\"".concat(reader.result, "\" /></span>");
        msgEl.appendChild(itemEl);

        _this2.doScrollToBottom();

        if (!_this2.isSelf) {
          globalThis.nodeRequire('electron').ipcRenderer.send('send-msg', JSON.stringify({
            target: _this2.info.yourip,
            data: {
              type: "talker",
              value: {
                mac: _this2.info.mymac,
                type: "image@base64",
                content: reader.result
              }
            }
          }));
        } // 写入磁盘保存起来


        var history = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-talker", _this2.info.yourmac);
        history.push({
          time: new Date().valueOf(),
          content: reader.result,
          align: "right",
          type: "image@base64"
        });
        globalThis.nodeRequire('electron').ipcRenderer.send('set-talker', {
          mac: _this2.info.yourmac,
          value: history
        });
      };

      reader.readAsDataURL(file);
    } // 发送信息

  }, {
    key: "doSend",
    value: function doSend() {
      if (this.content.trim() == "") {
        this.content = "";
        return;
      }

      var itemEl = document.createElement('div');
      itemEl.setAttribute('class', 'right item-talker');
      itemEl.innerHTML = "<span>".concat(stringToTemplate(this.content), "</span>");
      msgEl.appendChild(itemEl);
      this.doScrollToBottom();

      if (!this.isSelf) {
        globalThis.nodeRequire('electron').ipcRenderer.send('send-msg', JSON.stringify({
          target: this.info.yourip,
          data: {
            type: "talker",
            value: {
              mac: this.info.mymac,
              type: "string",
              content: this.content
            }
          }
        }));
      } // 写入磁盘保存起来


      var history = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-talker", this.info.yourmac);
      history.push({
        time: new Date().valueOf(),
        content: this.content,
        align: "right",
        type: "string"
      });
      globalThis.nodeRequire('electron').ipcRenderer.send('set-talker', {
        mac: this.info.yourmac,
        value: history
      });
      this.content = "";
    }
  }, {
    key: "isToMe",
    value: function isToMe(target) {
      // 如果是广播，接收
      if (target == '255.255.255.255') return true; // 如果和目标ip一样，接收

      for (var index = 0; index < this.info.myip.length; index++) {
        if (this.info.myip[index] == target) return true;
      }

      return false;
    }
  }, {
    key: "$setup",
    value: function $setup() {
      return {
        info: ref({
          yourname: "",
          yourip: "",
          mymac: "",
          myip: [],
          yourmac: ""
        }),
        content: ref(""),
        isSelf: ref(false)
      };
    }
  }, {
    key: "$mounted",
    value: function $mounted() {
      var _this3 = this;

      // 初始化同步信息
      this.info = globalThis.nodeRequire("electron").ipcRenderer.sendSync("init-info"); // 判断是不是自己

      this.isSelf = this.info.mymac == this.info.yourmac;
      msgEl = document.getElementById('msg'); // 启动事件监听主进程

      globalThis.nodeRequire('electron').ipcRenderer // 监听别的软件发送来的信息
      .on("get-msg", function (event, data) {
        var msg = JSON.parse(decodeURIComponent(data.msg));

        if (msg.data.type == 'talker') {
          if (_this3.isToMe(msg.target)) {
            var itemEl = document.createElement('div');
            itemEl.setAttribute('class', 'left item-talker');

            if (msg.data.value.type == 'string') {
              itemEl.innerHTML = "<span>".concat(stringToTemplate(msg.data.value.content), "</span>");
            } else if (msg.data.value.type == 'image@base64') {
              itemEl.innerHTML = "<span><img style='max-width:240px;padding-top:10px;' src=\"".concat(msg.data.value.content, "\" /></span>");
            }

            msgEl.appendChild(itemEl);

            _this3.doScrollToBottom();
          }
        }
      });
    } // 打开历史记录窗口

  }, {
    key: "openHistory",
    value: function openHistory() {
      globalThis.nodeRequire('electron').ipcRenderer.send('open-history', {
        mac: this.info.yourmac
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
// Original file:./node_modules/@hai2007/tool/animation.js
/*****************************************************************/
window.__etcpack__bundleSrc__['31']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    //当前正在运动的动画的tick函数堆栈
var $timers = [];
//唯一定时器的定时间隔
var $interval = 13;
//指定了动画时长duration默认值
var $speeds = 400;
//定时器ID
var $timerId = null;

/*!
 * 💡 - 动画轮播
 * https://github.com/hai2007/tool.js/blob/master/animation.js
 *
 * author hai2007 < https://hai2007.gitee.io/sweethome >
 *
 * Copyright (c) 2020-present hai2007 走一步，再走一步。
 * Released under the MIT license
 */

/**
 * @param {function} doback 轮询函数，有一个形参deep，0-1，表示执行进度
 * @param {number} duration 动画时长，可选
 * @param {function} callback 动画结束回调，可选，有一个形参deep，0-1，表示执行进度
 *
 * @returns {function} 返回一个函数，调用该函数，可以提前结束动画
 */
__etcpack__scope_bundle__.default= function (doback, duration, callback) {

    // 如果没有传递时间，使用内置默认值
    if (arguments.length < 2) duration = $speeds;

    var clock = {
        //把tick函数推入堆栈
        "timer": function (tick, duration, callback) {
            if (!tick) {
                throw new Error('Tick is required!');
            }
            var id = new Date().valueOf() + "_" + (Math.random() * 1000).toFixed(0);
            $timers.push({
                "id": id,
                "createTime": new Date(),
                "tick": tick,
                "duration": duration,
                "callback": callback
            });
            clock.start();
            return id;
        },

        //开启唯一的定时器timerId
        "start": function () {
            if (!$timerId) {
                $timerId = setInterval(clock.tick, $interval);
            }
        },

        //被定时器调用，遍历timers堆栈
        "tick": function () {
            var createTime, flag, tick, callback, timer, duration, passTime, needStop,
                timers = $timers;
            $timers = [];
            $timers.length = 0;
            for (flag = 0; flag < timers.length; flag++) {
                //初始化数据
                timer = timers[flag];
                createTime = timer.createTime;
                tick = timer.tick;
                duration = timer.duration;
                callback = timer.callback;
                needStop = false;

                //执行
                passTime = (+new Date() - createTime) / duration;
                if (passTime >= 1) {
                    needStop = true;
                }
                passTime = passTime > 1 ? 1 : passTime;
                tick(passTime);
                if (passTime < 1 && timer.id) {
                    //动画没有结束再添加
                    $timers.push(timer);
                } else if (callback) {
                    callback(passTime);
                }
            }
            if ($timers.length <= 0) {
                clock.stop();
            }
        },

        //停止定时器，重置timerId=null
        "stop": function () {
            if ($timerId) {
                clearInterval($timerId);
                $timerId = null;
            }
        }
    };

    var id = clock.timer(function (deep) {
        //其中deep为0-1，表示改变的程度
        doback(deep);
    }, duration, callback);

    // 返回一个函数
    // 用于在动画结束前结束动画
    return function () {
        var i;
        for (i in $timers) {
            if ($timers[i].id == id) {
                $timers[i].id = undefined;
                return;
            }
        }
    };

};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/pages/Talker/index.scss
/*****************************************************************/
window.__etcpack__bundleSrc__['32']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= "\n .view{\n\nbackground-color: rgb(221, 237, 249);\n\nbackground-image: linear-gradient(rgb(221, 237, 249), rgb(205, 223, 232), rgb(174, 217, 250));\n\nheight: 100vh;\n\n}\n\n .view>header{\n\nposition: relative;\n\n}\n\n .view>header>h2{\n\nfont-size: 14px;\n\nline-height: 30px;\n\nbackground-image: url('./image/logo.png');\n\nbackground-size: auto 70%;\n\nbackground-repeat: no-repeat;\n\nbackground-position: 10px center;\n\npadding-left: 40px;\n\nfont-weight: 200;\n\nfont-family: cursive;\n\n}\n\n .view>header>.btn{\n\nposition: absolute;\n\nwidth: 20px;\n\nheight: 20px;\n\nbackground-position: center center;\n\ntop: 0;\n\nfont-size: 0;\n\nbackground-repeat: no-repeat;\n\ncursor: pointer;\n\n}\n\n .view>header>.btn:hover{\n\nbackground-color: rgb(202, 226, 245);\n\n}\n\n .view>header>.btn.min{\n\nbackground-image: url('./image/min.png');\n\nright: 40px;\n\n}\n\n .view>header>.btn.close{\n\nbackground-image: url('./image/close.png');\n\nright: 10px;\n\n}\n\n .view>div.main{\n\nheight: calc(100vh - 30px);\n\ndisplay: flex;\n\npadding: 5px;\n\n}\n\n .view>div.main>div.left{\n\nflex-grow: 1;\n\npadding: 0 10px;\n\n}\n\n .view>div.main>div.left>div.msg-win{\n\nborder: 1px solid rgb(3, 101, 131);\n\nheight: calc(100% - 30px);\n\nborder-radius: 5px;\n\n}\n\n .view>div.main>div.left>div.msg-win #msg{\n\nwidth: 100%;\n\nheight: calc(100% - 130px);\n\nbackground-color: white;\n\nborder-radius: 5px 5px 0 0;\n\noverflow: auto;\n\n}\n\n .view>div.main>div.left>div.msg-win .help-input{\n\nheight: 30px;\n\npadding: 0 5px;\n\n}\n\n .view>div.main>div.left>div.msg-win .help-input>label{\n\ndisplay: inline-block;\n\nwidth: 30px;\n\nheight: 30px;\n\nfont-size: 0;\n\nvertical-align: top;\n\nbackground-position: center center;\n\nbackground-size: 80% auto;\n\nbackground-repeat: no-repeat;\n\ncursor: pointer;\n\n}\n\n .view>div.main>div.left>div.msg-win .help-input>label.image{\n\nbackground-image: url('./image/image.png');\n\n}\n\n .view>div.main>div.left>div.msg-win #input{\n\nwidth: 100%;\n\nheight: 100px;\n\noutline: none;\n\nborder: none;\n\nborder-radius: 0 0 5px 5px;\n\nresize: none;\n\nfont-weight: 200;\n\nfont-family: cursive;\n\n}\n\n .view>div.main>div.left>div.btns{\n\nheight: 30px;\n\ntext-align: right;\n\n}\n\n .view>div.main>div.left>div.btns>button{\n\nfont-size: 12px;\n\noutline: none;\n\nborder: none;\n\nbackground-color: rgb(84, 167, 239);\n\ncolor: white;\n\npadding: 2px;\n\nmargin-top: 5px;\n\nmargin-right: 10px;\n\nwidth: 60px;\n\ncursor: pointer;\n\n}\n\n .view>div.main>div.right{\n\nflex-grow: 0;\n\nflex-shrink: 0;\n\nflex-basis: 200px;\n\noutline: 1px solid rgb(3, 101, 131);\n\nmargin-bottom: 7px;\n\npadding: 0 0 10px 10px;\n\n}\n\n .view>div.main>div.right>span{\n\nborder: 1px solid rgb(198, 195, 195);\n\ndisplay: inline-block;\n\nwidth: 53px;\n\nheight: 50px;\n\npadding-top: 33px;\n\ntext-align: center;\n\nfont-size: 7px;\n\nbackground-color: white;\n\nmargin: 10px 10px 0 0;\n\nborder-radius: 5px;\n\nbackground-repeat: no-repeat;\n\nbackground-position: center 3px;\n\nbackground-size: 60% auto;\n\ncursor: pointer;\n\n}\n\n .view>div.main>div.right>span:hover{\n\nborder: 1px solid rgb(0, 0, 0);\n\ntext-decoration: underline;\n\n}\n\n .view>div.main>div.right>span.history{\n\nbackground-image: url('./image/history.png');\n\n}\n\n .not-show-view{\n\ndisplay: none;\n\n}\n"
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/pages/Talker/index.html
/*****************************************************************/
window.__etcpack__bundleSrc__['33']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= "<div class=\"view\">\r\n    <header>\r\n        <h2 style=\"-webkit-app-region: drag\" ui-bind='\"与 \" + info.yourname + \" 对话中（IP:\" + info.yourip + \"）\"'></h2>\r\n        <span class=\"btn min\" style=\"-webkit-app-region: no-drag\" ui-on:click=\"minimize\">\r\n            最小化\r\n        </span>\r\n        <span class=\"btn close\" style=\"-webkit-app-region: no-drag\" ui-on:click='quit'>\r\n            关闭\r\n        </span>\r\n    </header>\r\n    <div class=\"main\">\r\n        <div class=\"left\">\r\n            <div class=\"msg-win\">\r\n                <div id=\"msg\"></div>\r\n                <div class=\"help-input\">\r\n                    <label class=\"image\" for=\"sendImage\">\r\n                        图片\r\n                    </label>\r\n                </div>\r\n                <textarea id=\"input\" ui-model=\"content\" ui-on:keydown=\"doKeydown\"></textarea>\r\n            </div>\r\n            <div class=\"btns\">\r\n                <button ui-on:click=\"doSend\" id=\"send-btn\">发送</button>\r\n            </div>\r\n        </div>\r\n        <div class=\"right\">\r\n            <span class=\"history\" ui-on:click=\"openHistory\">聊天记录</span>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<!-- 帮助隐藏 -->\r\n<div class=\"not-show-view\">\r\n\r\n    <!-- 选择图片发送 -->\r\n    <input type=\"file\" id=\"sendImage\" ui-on:change=\"sendImage\" accept=\"image/*\" />\r\n\r\n</div>\r\n"
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/tool/stringToTemplate.ts
/*****************************************************************/
window.__etcpack__bundleSrc__['34']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= (function (str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, "<br />");
});
  
    return __etcpack__scope_bundle__;
}
