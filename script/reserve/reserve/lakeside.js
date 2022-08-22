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
  const addr = location.href.split("?")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.lakeside.kr/mobile/main/mainPage.do": funcMain,
    "https://www.lakeside.kr/mobile/user/sign/Logout.do": funcOut,
    "https://www.lakeside.kr/mobile/reservation/my_golfreslist.do":
      funcList,
  };

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    남Out: "1",
    남In: "2",
    동Out: "3",
    동In: "4",
    서Out: "5",
    서In: "6",
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
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
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
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");

    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      LOGOUT();
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {});
    let sign = fulldate.daySign();
    if (sign != 1) sign = 2;
    timefrom_change(fulldate, sign, fulldate.dayNum(), "", "00", "T");
    timer(2000, funcTime);
  }
  function funcTime() {
    log("funcTime");
    log("timeresbtn_" + dictCourse[course] + "_" + time);

    timelist_view('0');
    timer(500, exec);

    function exec() {
      const els = doc.gcn("cm_time_list_tbl")[0].gtn("tbody")[0].gtn("tr");
      let target;
      els.every(el => {
        const param = el.attr("onclick").inparen();
        const [, elCourse, elTime] = param;
        const sign = dictCourse[course];

        log(time, elTime, sign, elCourse);
        log(time == elTime, sign == elCourse);

        if(time == elTime, sign == elCourse) target = el;

        return !target;
      });
  
      log("target", target);
      if (target) {
        target.click();
        timer(500, funcExec);
      } else {
        LOGOUT();
      }
    }

  }
  function funcExec() {
    log("funcExec");
    const num = golfTimeDiv2CertNo.str();
    certNoChk.value = num;
    window["agree_chk"][0].click();

    doc.gcn("cm_btn default")[0].click();
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    location.href = "/mobile/user/sign/Logout.do";
  }
})();
