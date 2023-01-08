javascript: (() => {
  const log = console.log;
  const dir = console.dir;
  const OUTER_ADDR_HEADER = "https://op.mnemosyne.co.kr";
  function TZLOG(param, callback) {
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newLog";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      callback(data);
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
  Array.prototype.trav = function (fnc) {
    for (var i = 0, lng = this.length; i < lng; i++) {
      var a = fnc(this[i], i);
      if (a) break;
    }
  };
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

  const addr = location.href;
  if (addr == "https://tgv.kmhleisure.com/Mobile/Member/LoginNew.aspx") {
    javascript: (() => {
      const log = console.log;
      const dir = console.dir;
      const OUTER_ADDR_HEADER = "https://op.mnemosyne.co.kr";
      function TZLOG(param, callback) {
        const addr = OUTER_ADDR_HEADER + "/api/reservation/newLog";
        post(addr, param, { "Content-Type": "application/json" }, (data) => {
          callback(data);
        });
      }
      function post(addr, param, header, callback) {
        var a = new ajaxcallforgeneral(),
          str = [];
        if (header["Content-Type"] == "application/json") {
          str = JSON.stringify(param);
        } else {
          for (var el in param)
            str.push(el + "=" + encodeURIComponent(param[el]));
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
      Array.prototype.trav = function (fnc) {
        for (var i = 0, lng = this.length; i < lng; i++) {
          var a = fnc(this[i], i);
          if (a) break;
        }
      };
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

      const param = {
        type: "command",
        sub_type: "login",
        device_id: "${deviceId}",
        device_token: "${deviceToken}",
        golf_club_id: "b20397aa-7dea-11ec-b15c-0242ac110005",
        message: "start login",
        parameter: JSON.stringify({}),
      };
      TZLOG(param, (data) => {
        log(data);
        user_id.value = "mnemosyne";
        user_pw.value = "ya2ssarama!";
        login();
      });
    })();
  } else if (addr == "https://tgv.kmhleisure.com/Mobile/Tgv/Default.aspx") {
    const clubId = "b20397aa-7dea-11ec-b15c-0242ac110005";
    const courses = {
      단일: "1f06bc72-7deb-11ec-b15c-0242ac110005",
    };
    const OUTER_ADDR_HEADER = "https://op.mnemosyne.co.kr";
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

    const dates = [];
    const result = [];
    const golf_schedule = [];

    mneCall(thisdate, () => {
      Update("CALENDAR|" + nextyear + "-" + nextmonth + "|");
      setTimeout(() => {
        mneCall(nextdate, procDate);
      }, 1000);
    });

    function procDate() {
      const lmt = dates.length - 1;
      let cnt = 0;
      const timer = setInterval(() => {
        if (cnt > lmt) {
          clearInterval(timer);
          procGolfSchedule();
          return;
        }
        const arrDate = dates[cnt];
        console.log("수집하기", cnt + "/" + lmt, arrDate[0]);
        mneCallDetail(arrDate);
        cnt++;
      }, 300);
    }
    function procGolfSchedule() {
      golf_schedule.forEach((obj) => {
        obj.golf_course_id = courses[obj.golf_course_id];
        obj.date =
          obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
      });
      console.log(golf_schedule);
      const param = { golf_schedule, golf_club_id: clubId };
      post(addrOuter, param, header, () => {
        const ac = window.AndroidController;
        if (ac)
          ac.message(JSON.stringify({ command: "end of procGolfSchedule!" }));
      });
    }
    function mneCallDetail(arrDate) {
      const [date, strParam] = arrDate;
      const param = {
        strReserveDate: date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2),
        strGolfLgubun: 113,
      };

      get("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
        const ifr = document.createElement("div");
        ifr.innerHTML = data;

        const tbl = ifr.getElementsByClassName("cosTable")[0];
        const els = tbl.getElementsByTagName("tr");

        const obTeams = {};
        Array.from(els).forEach((el, i) => {
          if (i === 0) return;
          const course = "단일";
          const time = el.children[1].children[0].innerText;
          const fee_discount = el.children[3].innerText.split(",").join("") * 1;
          const fee_normal = el.children[2].innerText.split(",").join("") * 1;

          golf_schedule.push({
            golf_club_id: clubId,
            golf_course_id: course,
            date,
            time,
            in_out: "",
            persons: "",
            fee_normal,
            fee_discount,
            others: "9홀",
          });
        });
      });
    }
    function mneCall(thisdate, callback) {
      const param = {};
      const els = document.getElementsByClassName("can");
      Array.from(els).forEach((el) => {
        const href = el.getAttribute("href");
        if (href === "#") return;
        const date = thisdate + el.innerText.addzero();
        dates.push([date, ""]);
      });
      callback();
    }
  } else {
    location.href = "https://tgv.kmhleisure.com/Mobile/Tgv/Default.aspx";
  }
})();
