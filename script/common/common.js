const log = console.log;
const dir = console.dir;
const doc = document;
const ls = localStorage;
const OUTER_ADDR_HEADER = "${apiHeader}";
const LOGID = new Date().getTime();
const logParam = {
  type: "command",
  sub_type: "",
  device_id: "${deviceId}",
  device_token: "${deviceToken}",
  golf_club_id: "${golfClubId}",
  message: "",
  parameter: JSON.stringify({ LOGID }),
};
let ac = false;
try {
  ac = window.AndroidController || window.webkit.messageHandlers.iosController;
  ac.message =
    ac.message || window.webkit.messageHandlers.iosController.postMessage;
} catch (e) {
  ac = false;
}

const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
const aDDr = location.href.split(splitter)[0];
const suffix = location.href.split(splitter)[1];
const dictSplitter = { "#": "?", "?": "#" };
let addr = aDDr;
if (aDDr.indexOf(dictSplitter[splitter]) != -1)
  addr = aDDr.split(dictSplitter[splitter])[0];

EXTZLOG("url", "raw addr :: " + location.href);
EXTZLOG("url", "aDDr :: " + aDDr);
EXTZLOG("url", "addr :: " + addr);

function LSCHK(str, sec) {
  const tag = lsg(str);
  log("time check", new Date().getTime() - tag, 1000 * sec);
  if (tag && new Date().getTime() - tag < 1000 * sec) return false;
  lss(str, new Date().getTime());
  return true;
}
function TZLOG(param, callback) {
  const addr = OUTER_ADDR_HEADER + "/api/reservation/newLog";
  post(addr, param, { "Content-Type": "application/json" }, (data) => {
    if (callback) callback(data);
  });
}
function EXTZLOG(subtype, message, param) {
  logParam.sub_type = subtype;
  logParam.message = message;
  if (param) logParam.parameter = JSON.stringify(param);
  TZLOG(logParam);
}
function post(addr, param, header, callback) {
  var a = new ajaxcallforgeneral(),
    str = [];
  if (header["Content-Type"] == "application/json") {
    str = JSON.stringify(param);
  } else {
    for (var el in param) str.push(el + "=" + encodeURIComponent(param[el]));
    str = str.join("&");
  }
  a.post(addr, str, header);
  a.ajaxcallback = callback;
}
function get(addr, param, header, callback) {
  var a = new ajaxcallforgeneral(),
    str = [];
  for (var el in param) {
    str.push(el + "=" + param[el]);
  }
  str = str.join("&");
  a.jAjax(addr + "?" + str, header);
  a.ajaxcallback = callback;
}
function ajaxcallforgeneral() {
  this.xmlHttp;
  var j = this;
  var HTTP = {};
  var ADDR;
  var PARAM;
  var HEADER;
  this.jAjax = function (address, header) {
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.onerror = onError;
    j.xmlHttp.open("GET", address, true);
    if (header) {
      Object.keys(header).forEach((key) => {
        var val = header[key];
        j.xmlHttp.setRequestHeader(key, val);
      });
    }
    j.xmlHttp.send(null);
  };
  this.post = function (addr, prm, header) {
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.onerror = onError;
    j.xmlHttp.open("POST", addr, true);

    if (header) {
      if (header["Content-Type"])
        Object.keys(header).forEach((key) => {
          var val = header[key];
          j.xmlHttp.setRequestHeader(key, val);
        });
      else
        j.xmlHttp.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
    } else {
      j.xmlHttp.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
    }

    ADDR = addr;
    PARAM = prm;
    HEADER = JSON.stringify(header);

    j.xmlHttp.send(prm);
  };
  this.file = function (addr, prm) {
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.open("POST", addr, true);
    j.xmlHttp.send(prm);
  };
  function onError() {}
  function on_ReadyStateChange() {
    if (j.xmlHttp.readyState == 4) {
      if (j.xmlHttp.status == 200) {
        var data = j.xmlHttp.responseText;
        j.ajaxcallback(data);
      } else {
      }
    }
  }
}
function lsg(str) {
  return localStorage.getItem(str);
}
function lss(key, val) {
  return localStorage.setItem(key, val);
}
function lsr(str) {
  return localStorage.removeItem(str);
}
function lsc() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.indexOf("TZ_") == -1) return;
    lsr(key);
  });
}
String.prototype.gt = function (num) {
  return this.substring(this.length - num, this.length);
};
String.prototype.gh = function (num) {
  return this.substring(0, num);
};
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};
String.prototype.ch = function (num) {
  return this.substring(num, this.length);
};
String.prototype.addzero = function () {
  if (this.length == 1) return "0" + this;
  return this;
};
String.prototype.inparen = function (opt) {
  const regex = /.+?\((.+)\)/;
  const str = this.toString();
  const result = [];
  const org = regex.exec(str)[1];
  if (opt) {
    let ar = [];
    let flg = false;
    Array.from(org).forEach((chr) => {
      if (chr == "'") {
        flg = !flg;
      } else if (chr == ",") {
        if (flg) {
          ar.push(chr);
        } else {
          result.push(ar.join(""));
          ar = [];
        }
      } else {
        ar.push(chr);
      }
    });
    if (ar.length > 0) {
      result.push(ar.join(""));
      ar = [];
    }
  } else {
    org
      .split("'")
      .join("")
      .split(",")
      .forEach((str) => {
        result.push(str.trim());
      });
  }
  return result;
};
String.prototype.datify = function (sign) {
  const str = this.toString();
  if (!sign) sign = "-";
  return [str.gh(4), str.ch(4).gh(2), str.gt(2)].join(sign);
};
String.prototype.getFee = function () {
  let str = this.toString();
  str = str.replace(/[^0-9]/g, "");
  return str * 1;
};
String.prototype.daySign = function () {
  const str = this.getFee().toString();
  const num = new Date(str.datify()).getDay();
  let sign;
  if (num == 0) sign = 3;
  else if (num == 6) sign = 2;
  else sign = 1;
  return sign.toString();
};
String.prototype.dayNum = function () {
  const str = this.getFee().toString();
  const num = new Date(str.datify()).getDay();
  return (num + 1).toString();
};
String.prototype.dayKor = function () {
  const str = this.getFee().toString();
  const num = new Date(str.datify()).getDay();
  const week = ["일", "월", "화", "수", "목", "금", "토"];

  return week[num];
};
String.prototype.rm = function (str) {
  return this.split(str).join("");
};
String.prototype.fillzero = function (sep) {
  const ar = this.split(sep);
  const result = [];
  ar.forEach((el) => {
    result.push(el.addzero());
  });

  return result.join("");
};
String.prototype.jp = function () {
  return JSON.parse(this);
};
String.prototype.regex = function (re) {
  return re.exec(this);
};
String.prototype.gup = function () {
  /*get url param*/
  const param = {};
  this.split("?")[1]
    .split("&")
    .forEach((str) => {
      const [key, val] = str.split("=");
      param[key] = val;
    });
  return param;
};
String.prototype.sort = function () {
  return Array.from(this).sort().join("");
};
String.prototype.vector = function () {
  /* 정렬한 뒤, 겹치는 글자는 뺀다. */
  const res = {};
  Array.from(this)
    .sort()
    .forEach((chr) => (res[chr] = true));
  return Object.keys(res).join("");
};
String.prototype.comp = function (str) {
  let a = Array.from(this);
  let b = Array.from(str);
  let c;
  if (b.length > a.length) {
    c = a;
    a = b;
    b = c;
    c = undefined;
  }

  const res = [];

  exec();

  function exec() {
    let flg = false;
    let cur = b.shift();
    let tmp = [];
    a.forEach((chr) => {
      if (chr == cur) {
        flg = true;
        tmp.push(cur);
        cur = b.shift();
      } else {
        if (flg) {
          flg = false;
          if (tmp.length > 0) {
            res.push(tmp);
            tmp = [];
          }
          if (cur != undefined) {
            b.unshift(cur);
            exec();
          }
        }
      }
    });
    if (tmp.length > 0) {
      res.push(tmp);
      if (cur != undefined) {
        b.unshift(cur);
        exec();
      }
    }
  }
  return res;
};
HTMLElement.prototype.str = function () {
  return this.innerText;
};
HTMLElement.prototype.add = function (tag) {
  const el = document.createElement(tag);
  this.appendChild(el);
  return el;
};
HTMLElement.prototype.attr = function (str) {
  return this.getAttribute(str);
};
HTMLElement.prototype.gcn = function (str) {
  const els = this.getElementsByClassName(str);
  return Array.from(els);
};
HTMLElement.prototype.gtn = function (str) {
  const els = this.getElementsByTagName(str);
  return Array.from(els);
};
HTMLElement.prototype.gbn = function (str) {
  const els = this.getElementsByName(str);
  return Array.from(els);
};
HTMLElement.prototype.str = function (str) {
  return this.innerText;
};
HTMLElement.prototype.trav = function (fnc) {
  fnc(this);
  var a = this.children.length;
  for (var i = 0; i < a; i++) {
    if (this.children[i].trav) this.children[i].trav(fnc);
  }
};
HTMLElement.prototype.gba = function (attr, val, opt) {
  /* getElementsByAttribute */
  const res = [];
  this.trav((el) => {
    const str = el.attr(attr);
    if (!str) return;
    if (opt) {
      if (str.indexOf(val) != -1) res.push(el);
    } else {
      if (str == val) res.push(el);
    }
  });
  return res;
};
HTMLElement.prototype.nm = function () {
  /* node move */
  const args = Array.from(arguments);
  const up = args.shift();
  let el = this;
  for (let i = 0; i < up; i++) {
    const p = el.parentNode;
    if (p) el = p;
  }

  args.forEach((num) => {
    const p = el.children[num];
    if (p) el = p;
  });

  return el;
};
document.gcn = function (str) {
  const els = this.getElementsByClassName(str);
  return Array.from(els);
};
document.gtn = function (str) {
  const els = this.getElementsByTagName(str);
  return Array.from(els);
};
document.gbn = function (str) {
  const els = this.getElementsByName(str);
  return Array.from(els);
};
document.clm = function (str) {
  return document.createElement(str);
};
document.gba = function (attr, val, opt) {
  /* getElementsByAttribute */
  const res = [];
  this.body.trav((el) => {
    const str = el.attr(attr);
    if (!str) return;
    if (opt) {
      if (str.indexOf(val) != -1) res.push(el);
    } else {
      if (str == val) res.push(el);
    }
  });
  return res;
};
window.timer = function (time, callback) {
  setTimeout(callback, time);
};
/* 이 부분 자리 옮기지 마시오.*/
console.clear();
