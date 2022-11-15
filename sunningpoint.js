javascript: (() => {
  /* test */
  const log = console.log;
  const dir = console.dir;
  const doc = document;
  const ls = localStorage;
  const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
  const logParam = {
    type: "command",
    sub_type: "",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "",
    parameter: JSON.stringify({}),
  };
  let ac = false;
  try {
    ac =
      window.AndroidController || window.webkit.messageHandlers.iosController;
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

  logParam.sub_type = "url";
  logParam.message = "raw addr :: " + location.href;
  TZLOG(logParam);
  logParam.message = "aDDr :: " + aDDr;
  TZLOG(logParam);
  logParam.message = "addr :: " + addr;
  TZLOG(logParam);
  log("addr", addr);

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
          if (flg) {
            flg = false;
          } else {
            flg = true;
          }
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
  String.prototype.regex = function (regex) {
    return this.replace(regex, "");
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
      this.children[i].trav(fnc);
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
  document.gba = function (attr, val) {
    /* getElementsByAttribute */
    const res = [];
    this.body.trav((el) => {
      const str = el.attr(attr);
      if (str == val) res.push(el);
    });
    return res;
  };
  window.timer = function (time, callback) {
    setTimeout(callback, time);
  };
  /* 이 부분 자리 옮기지 마시오.*/
  console.clear();

  const dict = {
    "https://www.sunningpoint.com/_mobile/login/login.asp": funcLogin,
    "https://www.sunningpoint.com/_mobile/golfRes/real_calendar.asp":
      funcReserve,
  };

  function funcLogin() {
    log("funcLogin");

    const chk = LSCHK("TZ_SEARCH_LOGIN" + clubId, 5);
    if (!chk) {
      log("funcLogin Timein ERROR");
      location.href =
        "https://www.sunningpoint.com/_mobile/golfRes/real_calendar.asp";
      return;
    }

    login_id.value = "${login_id}";
    login_pw.value = "${login_password}";
    chkLogValue(frmLogin, "in", frmLogin.mem_id, frmLogin.usr_pwd);

    return;
  }

  /* begin blocking infinite call */
  let TZ_BOT_SAFETY = true;
  let visitNumber = lsg("TZ_ADMIN_BLOCK_IC") * 1;
  let lastVistTime = lsg("TZ_ADMIN_BLOCK_IC_TIME") * 1;
  let curTimeforVisit = new Date().getTime();
  log(visitNumber, visitNumber == null);
  if (lsg("TZ_ADMIN_BLOCK_IC") != null) {
    log(1);
    if (curTimeforVisit - lastVistTime < 1000 * 15) {
      log(2);
      if (visitNumber > 9) {
        log(3);
        if (ac) ac.message(JSON.stringify({ command: "TZ_MSG_IC" }));
        TZ_BOT_SAFETY = false;
        /* 초기화 */
        visitNumber = 0;
        lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
        /* 로그아웃 */
        if (LOGOUT) LOGOUT();
      }
    } else {
      log(4);
      visitNumber = 0;
      lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
    }
  } else {
    log(5);
    visitNumber = 0;
    lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
  }
  visitNumber++;
  lss("TZ_ADMIN_BLOCK_IC", visitNumber);
  log(
    "TZ_ADMIN_BLOCK_IC",
    lsg("TZ_ADMIN_BLOCK_IC"),
    lsg("TZ_ADMIN_BLOCK_IC_TIME")
  );
  /* end blocking infinite call */

  /* var splitter = location.href.indexOf("?") == -1 ? "#" : "?";
var aDDr = location.href.split(splitter)[0];
var suffix = location.href.split(splitter)[1];
var dictSplitter = {"#": "?", "?": "#"};
var addr = aDDr;
if(aDDr.indexOf(dictSplitter[splitter]) != -1) 
    addr = aDDr.split(dictSplitter[splitter])[0];

log("raw addr :: ", location.href);
log("aDDr :: ", aDDr);
log("addr :: ", addr); */

  let global_param = {};
  const COMMAND = "GET_DATE";
  const clubId = "0f927c36-f064-11ec-a93e-0242ac11000a";
  const courses = {
    Sun: "0f95aaab-f064-11ec-a93e-0242ac11000a",
    Point: "0f95ac68-f064-11ec-a93e-0242ac11000a",
  };
  log("step::", 1);
  const addrOuter = OUTER_ADDR_HEADER + "/api/reservation/golfSchedule";
  const header = { "Content-Type": "application/json" };

  const now = new Date();
  const thisyear = now.getFullYear() + "";
  const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
  const thisdate = thisyear + thismonth;

  now.setDate(28);
  now.setMonth(now.getMonth() + 1);
  const nextyear = now.getFullYear() + "";
  const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
  const nextdate = nextyear + nextmonth;

  log(thisdate, nextdate);

  let dates = [];
  const result = [];
  const golf_schedule = [];
  let lmt;
  function procDate() {
    if (lmt === undefined && dates.length == 0) {
      if (COMMAND == "GET_TIME") dates.push(["${TARGET_DATE}", 0]);
    }

    if (COMMAND == "GET_DATE") {
      const golf_date = [];
      dates.forEach(([date]) => {
        logParam.sub_type = "search";
        logParam.message = date;
        logParam.parameter = JSON.stringify({
          clubId,
          date,
          type: typeof date,
        });
        TZLOG(logParam, (data) => {});
        golf_date.push(date.datify("-"));
      });
      /* const param = {
      golf_date,
      golf_club_id: clubId,
      device_id: "${deviceId}",
    };
    log("golf_date", golf_date);
    post(
      OUTER_ADDR_HEADER + "/api/reservation/golfDate",
      param,
      header,
      (data) => {
        const json = JSON.parse(data);
        log(json.message);
      }
    ); */
      const acParam = {};
      if (golf_date.length == 0) {
        acParam.command = "NONE_OF_GET_DATE";
      } else {
        acParam.command = "SUCCESS_OF_GET_DATE";
        acParam.content = golf_date;
      }
      if (ac) {
        ac.message(JSON.stringify(acParam));
        lsc();
      }
      /* LOGOUT(); */

      return;
    }

    if (COMMAND == "GET_TIME") {
      log("target date", "${TARGET_DATE}", dates.length);

      const result = [];
      dates.every((arr) => {
        const [date] = arr;
        if (date == "${TARGET_DATE}") {
          result.push(arr);
          /* return false; */
        }
        return true;
      });
      dates = result;
    }

    if (lmt === undefined) lmt = dates.length - 1;
    const order = lmt - dates.length + 1;
    const arrDate = dates.shift();
    if (arrDate) {
      log("수집하기", order + "/" + lmt, arrDate[0]);
      log("TZ_PROGRESS," + order + "," + lmt + "," + arrDate[0]);
      const param = {
        type: "command",
        sub_type: "search",
        device_id: "${deviceId}",
        device_token: "${deviceToken}",
        golf_club_id: "${golfClubId}",
        message: "search",
        parameter: JSON.stringify({ order, total: lmt, date: arrDate[0] }),
      };
      TZLOG(param, (data) => {});
      mneCallDetail(arrDate);
    } else {
      procGolfSchedule();
    }
  }
  function procGolfSchedule() {
    golf_schedule.forEach((obj) => {
      obj.golf_course_name = obj.golf_course_id;
      let course_id = courses[obj.golf_course_id];
      if (!course_id && Object.keys(courses).length === 1)
        course_id = courses[Object.keys(courses)[0]];
      obj.golf_course_id = course_id;
      obj.date =
        obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
      if (obj.time.indexOf(":") == -1)
        obj.time = obj.time.gh(2) + ":" + obj.time.gt(2);
    });
    log("golf_schedule");
    log(golf_schedule);
    log(typeof golf_schedule);
    const acParam = {};
    if (golf_schedule.length == 0) {
      log("예약가능한 시간이 없습니다.");
      acParam.command = "NONE_OF_GET_SCHEDULE";
    } else {
      acParam.command = "end of procGolfSchedule!";
      acParam.content = golf_schedule;
    }
    if (ac) {
      ac.message(JSON.stringify(acParam));
      lsc();
    }
    /* LOGOUT(); */
    /* const param = {
    golf_schedule,
    device_id: "${deviceId}",
    golf_club_id: clubId,
  };
  post(addrOuter, param, header, (data) => {});
  const json = JSON.parse(data);
  log(json.message); */
  }
  /* 
[
  {
    club_id: "5d8163d1-cd85-11ec-a93e-0242ac11000a",
    club: "delphino",
    content: [
      {
        date: "2022-09-28",
        fee_discount: 210000,
        fee_normal: 210000,
        golf_club_id: "5d8163d1-cd85-11ec-a93e-0242ac11000a",
        golf_course_id: "b81cbf25-cd86-11ec-a93e-0242ac11000a",
        in_out: "",
        others: "OUT",
        persons: "",
        time: "07:07",
      },
      {
        date: "2022-09-28",
        fee_discount: 210000,
        fee_normal: 210000,
        golf_club_id: "5d8163d1-cd85-11ec-a93e-0242ac11000a",
        golf_course_id: "b81cc15a-cd86-11ec-a93e-0242ac11000a",
        in_out: "",
        others: "IN",
        persons: "",
        time: "07:07",
      },
    ],
  },
];
 */
  function mneCall(date, callback) {
    const els = doc.body.gba("onclick", "goSend", true);
    Array.from(els).forEach((el) => {
      const [, date, sign, gb] = el.attr("onclick").inparen();
      dates.push([date, sign, gb]);
    });
    callback();
  }

  function mneCallDetail(arrDate) {
    const fCall = { post, get };
    const [date, sign, gb] = arrDate;
    const addr = "/_mobile/golfRes/real_timeList.asp";
    const method = "post";
    const param = {
      pointdate: date,
      openyn: sign,
      dategbn: gb,
    };
    const dictCourse = {
      1: "Sun",
      2: "Point",
    };

    fCall[method](addr, param, {}, (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gba("href", "javascript:goSend", true);
      Array.from(els).forEach((el) => {
        let [, course, time] = el.attr("href").inparen(true);
        course = dictCourse[course];
        hole = el.nm(2, 2).str().trim().ct(1);
        const fee = el.nm(2, 3).str().ct(1).rm(",") * 1;
        fee_normal = fee;
        fee_discount = fee;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: hole + "홀",
        });
      });
      procDate();
    });
  }

  function LOGOUT() {
    log("LOGOUT");
    location.href = "javascript:()=>{}";
  }

  function main() {
    log("main");

    if (!TZ_BOT_SAFETY) {
      log("stopped by Infinite Call");
      return;
    }

    const func = dict[addr];
    if (!func) funcOther();
    else func();
  }

  function funcList() {
    log("funcList");
    location.href =
      "https://www.sunningpoint.com/_mobile/golfRes/real_calendar.asp";
    return;
  }
  function funcMain() {
    log("funcMain");

    const chk = LSCHK("TZ_SEARCH_MAIN" + clubId, 10);
    log("timeout chk", chk);
    if (!chk) {
      log("funcMain Timein ERROR");
      return;
    }

    location.href =
      "https://www.sunningpoint.com/_mobile/golfRes/real_calendar.asp";
    return;
  }
  function funcOut() {
    log("funcOut");

    funcEnd();

    return;
  }
  function funcOther() {
    log("funcOther");

    const chk = LSCHK("TZ_SEARCH_OTHER" + clubId, 10);
    log("timeout chk", chk);
    if (!chk) {
      log("funcOther Timein ERROR");
      return;
    }

    location.href =
      "https://www.sunningpoint.com/_mobile/golfRes/real_calendar.asp";

    return;
  }
  function funcReserve() {
    log("funcSearch");

    if (location.href == addr) {
      const chk = LSCHK("TZ_SEARCH_RESERVE" + clubId, 5);
      log("timeout chk", chk);
      if (!chk) {
        log("funcSearch Timein ERROR");
        return;
      }
    }

    mneCall(thisdate, procDate);

    return;
  }

  main();
})();
