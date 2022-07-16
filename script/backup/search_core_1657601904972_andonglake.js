function mneCall(date, callback) {
  const els = ReservationDate.getElementsByTagName("a");
  Array.from(els).forEach((el) => {
    const fulldate = el.innerText.split("-").join("");
    dates.push([fulldate, 0]);
  });
  callback();
}

/* <============line_div==========> */
javascript: (() => {
  const log = console.log;
  const dir = console.dir;
  const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
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
  String.prototype.inparen = function () {
    const regex = /.+\((.+)\)/;
    const str = this.toString();
    return regex.exec(str)[1].split("'").join("").split(",");
  };
  const clubId = "3a264e34-ef9f-11ec-a93e-0242ac11000a";
  const courses = {
    In: "3a28a099-ef9f-11ec-a93e-0242ac11000a",
    Out: "3a28a191-ef9f-11ec-a93e-0242ac11000a",
  };
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

  console.log(thisdate, nextdate);

  const dates = [];
  const result = [];
  const golf_schedule = [];
  let lmt;
  function procDate() {
    if (lmt === undefined && dates.length == 0) {
      const param = {
        type: "command",
        sub_type: "search",
        device_id: "${deviceId}",
        device_token: "${deviceToken}",
        golf_club_id: "3a264e34-ef9f-11ec-a93e-0242ac11000a",
        message: "no empty tees!!",
        parameter: JSON.stringify({ order: 0, total: 0 }),
      };
      TZLOG(param, (data) => {});
      return;
    }

    if (lmt === undefined) lmt = dates.length - 1;
    const order = lmt - dates.length + 1;
    const arrDate = dates.shift();
    if (arrDate) {
      console.log("수집하기", order + "/" + lmt, arrDate[0]);
      const param = {
        type: "command",
        sub_type: "search",
        device_id: "${deviceId}",
        device_token: "${deviceToken}",
        golf_club_id: "3a264e34-ef9f-11ec-a93e-0242ac11000a",
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
      let course_id = courses[obj.golf_course_id];
      if (!course_id && Object.keys(courses).length === 1)
        course_id = courses[Object.keys(courses)[0]];
      obj.golf_course_id = course_id;
      obj.date =
        obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
    });
    /* console.log(golf_schedule); */
    const param = { golf_schedule, golf_club_id: clubId };
    post(addrOuter, param, header, (data) => {
      console.log(data);
      const ac = window.AndroidController;
      if (ac) ac.message("end of procGolfSchedule!");
    });
  }
  function mneCall(date, callback) {
    const els = ReservationDate.getElementsByTagName("a");
    Array.from(els).forEach((el) => {
      const fulldate = el.innerText.split("-").join("");
      dates.push([fulldate, 0]);
    });
    callback();
  }

  /* <============line_div==========> */
  function mneCallDetail(arrDate) {
    const [date] = arrDate;
    const param = {
      Date: [date.gh(4), date.ch(4).gh(2), date.gt(2)].join("-"),
    };
    get("/BookingAdd.aspx", param, {}, (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;

      const trs1 = (() => {
        let target;
        Array.from(ifr.getElementsByTagName("div")).forEach((div) => {
          if (div.id == "Table_1") target = div;
        });
        return Array.from(target.getElementsByTagName("input"));
      })();
      const trs2 = (() => {
        let target;
        Array.from(ifr.getElementsByTagName("div")).forEach((div) => {
          if (div.id == "Table_2") target = div;
        });
        return Array.from(target.getElementsByTagName("input"));
      })();

      trs1.forEach((el, i) => {
        if (i === 0) return;
        const td = el.children[0];
        const course = "Out";
        const time = el.value;
        const fee_discount = td.children[2].innerText.split(",").join("") * 1;
        const fee_normal = td.children[2].innerText.split(",").join("") * 1;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: "18홀",
        });
      });

      trs2.forEach((el, i) => {
        if (i === 0) return;
        const td = el.children[0];
        const course = "In";
        const time = el.value;
        const fee_discount = 300000;
        const fee_normal = 300000;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: "18홀",
        });
      });
      procDate();
    });
  }

  /* <============line_div==========> */

  /* <============line_div==========> */
  mneCall(thisdate, procDate);
})();

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);