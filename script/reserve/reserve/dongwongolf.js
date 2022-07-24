javascript: (() => {
  //${commonScript}
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
    "https://dongwongolf.co.kr/_mobile/index.asp": funcMain,
    "https://dongwongolf.co.kr/_mobile/login/logout.asp": funcOut,
    "https://dongwongolf.co.kr/_mobile/GolfRes/onepage/my_golfreslist.asp":
      funcEnd,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    단일: "1",
  };
  const fulldate = [year, month, date].join("");

  if (!func) funcOther();
  else func();

  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcOut() {
    log("funcOut");
    return;
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    //${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    if (!suffix) return;

    const suffixParam = (() => {
      const result = {};
      suffix.split("&").forEach((item) => {
        const dv = item.split("=");
        result[dv[0]] = dv[1];
      });
      return result;
    })();

    log("settype", suffixParam["settype"]);
    if (suffixParam["settype"] == "") {
      log("calendar");
      funcDate();
    } else if (suffixParam["settype"] == "T") {
      log("time");
      funcTime();
    } else {
      return;
    }
  }
  function funcDate() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      let sign = fulldate.daySign();
      if (sign != 1) sign = 2;
      timefrom_change(fulldate, sign, fulldate.dayNum(), "", "00", "T");
    });
  }
  function funcTime() {
    log("funcTime");
    const els = document.gcn("pointer");
    let target;
    els.every((el) => {
      const param = el.attr("onclick").inparen();
      const elTime = param[2];
      log(elTime, time);
      log(elTime == time);
      if (elTime == time) target = el;

      return !target;
    });

    log("target", target);
    if (target) {
      target.click();
      timer(1000, funcExec);
    } else {
      funcEnd();
    }
  }
  function funcExec() {
    log("funcExec");
    document.gcn("cm_btn default")[0].click();
    setTimeout(funcEnd, 1000);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
    location.href = "/_mobile/login/logout.asp";
  }
})();
