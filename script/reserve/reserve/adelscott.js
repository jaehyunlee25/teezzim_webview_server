javascript: (() => {
  ${commonScript}
  const addr = location.href.split("#")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.adelscott.co.kr/_mobile/index.asp": funcMain,
    "https://www.adelscott.co.kr/_mobile/index.asp": funcOut,
    "https://www.adelscott.co.kr/_mobile/login/logout.asp": funcList,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  const dictCourse = {
    1: "Mountain",
    2: "Hill",
    3: "Lake",
  };
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
    log("funcLogin");

    if (window["tab0"]) {
      const els = tab0.getElementsByTagName("button");
      const fulldate = [year, month, date].join("");
      let target;
      
      Array.from(els).forEach((el) => {
        const param = el.getAttribute("onclick").inparen();
        const signCourse = param[1].trim();
        if (param[2].trim() == time && dictCourse[signCourse] == course)
          target = el;
      });
      if (target) target.click();
    } else if (document.getElementsByClassName("cm_btn default")[0]){
      const btn = document.getElementsByClassName("cm_btn default")[0];
      if (btn) btn.click();
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/reserve");
      location.href = "/login/logout.asp";
    } else {
      const param = {
        type: "command",
        sub_type: "reserve/reserve",
        device_id: "${deviceId}",
        device_token: "${deviceToken}",
        golf_club_id: "${golfClubId}",
        message: "start reserve/reserve",
        parameter: JSON.stringify({}),
      };
      TZLOG(param, (data) => {
        log(data);
        const fulldate = [year, month, date].join("");
        timefrom_change(fulldate, "2", "1", "", "00", "T");
      });
    }
  }  
})();
