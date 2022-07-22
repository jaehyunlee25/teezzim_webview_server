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
  };
  const func = dict[addr];
  const dictCourse = {};
  const fulldate = [year, month, date].join("");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());
    if(!suffix) return;

    const suffixParam = (() => {
      const result = {};
      suffix.split("&").forEach(item => {
        const dv = item.split("=");
        result[dv[0]] = dv[1];
      });
      return result;
    })();

    if(suffixParam["settype"] == "T") {
      log("calendar");
      funcDate();
    }else if(suffixParam["settype"] == "R") {
      log("time");
      funcTime();
    }
  }
  function funcDate() {
    TZLOG(logParam, (data) => {
      timefrom_change(fulldate,'2','1','','00','T')
    });
  }
  function funcTime() {    
    const els = document.getElementsByClassName("cm_dPdir");
    const dictCourse = {};
    let target;
    Array.from(els).forEach((el) => {
      const param = el.children[0].getAttribute("href").inparen();
      const elCourse = "단일";
      const elTime = param[2];
      if (course == elCourse && time == elTime) target = el.children[0];
    });
    if (target) {
      target.click();
      funcExec();
    } else {
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/reserve");
      location.href = "/Mobile/member/LogOut.aspx";
    }   
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    person_count2.click();
    document.getElementsByClassName("cm_ok")[0].click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      location.href = "/_mobile/login/logout.asp";
    }, 1000);
  }
})();
