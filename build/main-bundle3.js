
/*************************** [bundle] ****************************/
// Original file:./src/pages/History/index.ts
/*****************************************************************/
window.__etcpack__bundleSrc__['22']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    var _dec, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

__etcpack__scope_args__=window.__etcpack__getBundle('1');
var Component=__etcpack__scope_args__.Component;

__etcpack__scope_args__=window.__etcpack__getBundle('25');
var xhtml =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('35');
var style =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('36');
var template =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('34');
var stringToTemplate =__etcpack__scope_args__.default;


var _class = (_dec = Component({
  template: template,
  styles: [style]
}), _dec(_class2 = /*#__PURE__*/function () {
  function _class2() {
    _classCallCheck(this, _class2);
  }

  _createClass(_class2, [{
    key: "quit",
    value: function quit() {
      globalThis.nodeRequire('electron').ipcRenderer.send('quit-history');
    }
  }, {
    key: "minimize",
    value: function minimize() {
      globalThis.nodeRequire('electron').ipcRenderer.send('minimize-history');
    }
  }, {
    key: "$mounted",
    value: function $mounted() {
      // 初始化同步信息
      var info = globalThis.nodeRequire("electron").ipcRenderer.sendSync("history-init");
      var navEl = document.createElement('nav');
      document.getElementById('history-view').appendChild(navEl);
      var contentEl = document.createElement('div');
      document.getElementById('history-view').appendChild(contentEl);
      var btns = [];
      var initBtn;

      var _loop = function _loop(index) {
        var itemEl = document.createElement('span');
        var name = info.list[index].name;
        if (name.length > 10) name = name.substr(0, 10) + "...";
        itemEl.innerText = name + "(" + info.list[index].ip + ")";
        btns.push(itemEl);
        navEl.appendChild(itemEl);
        xhtml.bind(itemEl, 'click', function () {
          for (var k = 0; k < btns.length; k++) {
            btns[k].setAttribute('active', 'no');
          }

          itemEl.setAttribute('active', 'yes');
          var history = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-talker", info.list[index].mac);
          var template = "<h2>与 " + info.list[index].name + " 的聊天记录（IP:" + info.list[index].ip + "）</h2>";

          for (var _k = 0; _k < history.length; _k++) {
            // 聊天内容先只考虑文字，后续有空再慢慢丰富
            var date = new Date(history[_k].time);
            var hour = date.getHours() + "";
            var minute = date.getMinutes() + "";
            var second = date.getSeconds() + "";

            if (+hour <= 9) {
              hour = "0" + hour;
            }

            if (+minute <= 9) {
              minute = "0" + minute;
            }

            if (+second <= 9) {
              second = "0" + second;
            }

            var msgTemplate = void 0;

            if (history[_k].type == 'string') {
              msgTemplate = stringToTemplate(history[_k].content || "");
            } else if (history[_k].type == 'image@base64') {
              msgTemplate = "<img style='max-width:240px;padding-top:10px;' src=\"".concat(history[_k].content, "\" />");
            }

            template += "<div style='text-align:".concat(history[_k].align, "'>\n                            <div class='msg'>").concat(msgTemplate, "</div>\n                            <div class='time'>\n                            ").concat(date.getFullYear(), "\u5E74").concat(date.getMonth() + 1, "\u6708").concat(date.getDate(), "\u65E5\n                            ").concat(hour, ":").concat(minute, ":").concat(second, "\n                            </div>\n                    </div>");
          }

          contentEl.innerHTML = template;
        });

        if (info.list[index].mac == info.mac) {
          initBtn = itemEl;
        }
      };

      for (var index = 0; index < info.list.length; index++) {
        _loop(index);
      } //  初始化点击打开聊天窗口的记录


      initBtn.click();
    }
  }]);

  return _class2;
}()) || _class2);

__etcpack__scope_bundle__.default=_class;
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/pages/History/index.scss
/*****************************************************************/
window.__etcpack__bundleSrc__['35']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= "\n .view{\n\nbackground-color: rgb(221, 237, 249);\n\nbackground-image: linear-gradient(rgb(221, 237, 249), white);\n\nheight: 100vh;\n\n}\n\n .view>header{\n\nposition: relative;\n\n}\n\n .view>header>h2{\n\nfont-size: 14px;\n\nline-height: 30px;\n\nbackground-image: url('./image/logo.png');\n\nbackground-size: auto 70%;\n\nbackground-repeat: no-repeat;\n\nbackground-position: 10px center;\n\npadding-left: 40px;\n\nfont-weight: 200;\n\nfont-family: cursive;\n\n}\n\n .view>header>.btn{\n\nposition: absolute;\n\nwidth: 20px;\n\nheight: 20px;\n\nbackground-position: center center;\n\ntop: 0;\n\nfont-size: 0;\n\nbackground-repeat: no-repeat;\n\ncursor: pointer;\n\n}\n\n .view>header>.btn:hover{\n\nbackground-color: rgb(202, 226, 245);\n\n}\n\n .view>header>.btn.min{\n\nbackground-image: url('./image/min.png');\n\nright: 40px;\n\n}\n\n .view>header>.btn.close{\n\nbackground-image: url('./image/close.png');\n\nright: 10px;\n\n}\n"
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/pages/History/index.html
/*****************************************************************/
window.__etcpack__bundleSrc__['36']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= "<div class=\"view\">\r\n    <header>\r\n        <h2 style=\"-webkit-app-region: drag\">聊天记录</h2>\r\n        <span class=\"btn min\" style=\"-webkit-app-region: no-drag\" ui-on:click=\"minimize\">\r\n            最小化\r\n        </span>\r\n        <span class=\"btn close\" style=\"-webkit-app-region: no-drag\" ui-on:click='quit'>\r\n            关闭\r\n        </span>\r\n    </header>\r\n    <div id=\"history-view\"></div>\r\n</div>"
  
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
