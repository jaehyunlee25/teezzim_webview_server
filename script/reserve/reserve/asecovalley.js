javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/reserve",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/reserve",
    parameter: JSON.stringify({}),
  };
  const addr = location.href.split("#")[0];
  const suffix = location.href.split("#")[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "http://asecovalley.co.kr/_mobile/index.asp": funcMain,
    "http://asecovalley.co.kr/_mobile/login/logout.asp": funcOut,
    "http://asecovalley.co.kr/_mobile/GolfRes/onepage/my_golfreslist.asp": funcList,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    "단일": "1",
  };
  const fulldate = [year, month, date].join("");

  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    LOGOUT();
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcOut() {
    log("funcOut");
    funcEnd();
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    const suffixParam = (() => {
      const result = {};
      suffix.split("&").forEach(item => {
        const dv = item.split("=");
        result[dv[0]] = dv[1];
      });
      return result;
    })();

    log("settype", suffixParam["settype"]);
    if(suffixParam["settype"] == "T") {
      log("calendar");
      funcDate();
    }else if(suffixParam["settype"] == "R") {
      log("time");
      funcTime();
    }
  }
  function funcDate() {
    log("funcDate");

    TZLOG(logParam, (data) => {});
    let sign = fulldate.daySign();
    if (sign != 1) sign = 2;
    timefrom_change(fulldate, sign, fulldate.dayNum(), '', '00', 'T');
  }
  function funcTime() {
    log("funcTime");

    const els = doc.gcn("cm_dPdir");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.children[0].getAttribute("href").inparen();
      const elCourse = "단일";
      const elTime = param[2];

      log(course == elCourse, time == elTime);
      if (course == elCourse && time == elTime) target = el.children[0];
    });

    log("target", target);
    if (target) {
      target.click();
      timer(1000, funcExec);
    } else {
      LOGOUT();
    }   
  }
  function funcExec() {
    log("funcExec");

    person_count2.click();
    doc.gcn("cm_ok")[0].click();
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/_mobile/login/logout.asp";
  }
})();
