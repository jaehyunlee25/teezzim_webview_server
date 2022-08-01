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
    "https://www.ilcc.co.kr/mobile/index.asp": funcMain,
    "https://www.ilcc.co.kr/mobile/reservation/reservation2.asp": funcList,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  
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
    if (coPlace.innerText != "앙성면") {
      changeCoDiv("76");
    }
    TZLOG(logParam, (data) => {});
    setTimeout(funcDate, 3000);
  }
  function funcDate() {
    const fulldate = [year, month, date].join("");
    onClickDay(fulldate);
    setTimeout(funcTime, 3000);
  }
  function funcTime() {
    const els = window["time-grid"].children;
    const dictCourse = {
      Mountain: "M",
      Valley: "V",
      Lake: "L",
    };
    let target;
    Array.from(els).forEach((el) => {
      if (el.children.length < 2) return;
      const elCourse = el.children[0].innerText;
      const elTime = el.children[1].innerText.split(":").join("");
      if (dictCourse[course] == elCourse && time == elTime) target = el;
    });
    if (target) {
      target.children[5].children[0].click();
    } else {
      LOGOUT();
    }
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
    doLogout();
  }
})();
