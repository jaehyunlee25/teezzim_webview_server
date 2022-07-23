javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/cancel",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/cancel",
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
    "${reserveUrl}": funcReserve,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();
  function funcLogin() {    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      setTimeout(funcCancel, 1000);
    });
  }
  function funcCancel() {
    const els = document.getElementsByClassName("courseTime");
    const dictCourse = {
      A: "England",
      B: "Scotland",
      C: "Wales",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.innerText;
      const elDate = "20" + /[0-9]{2}\/[0-9]{2}/.exec(param)[0].split("/").join("");
      const elTime = /[0-9]{2}\:[0-9]{2}/.exec(param)[0].split(":").join("");
      const elCourse = /[A-Za-z]+/.exec(param)[0];
      console.log("reserve search", elCourse, elDate, elTime);
      const fulldate = [year, month, date].join("");
      log(elDate, fulldate,
        dictCourse[elCourse], course,
        elTime, time);
      if (
        elDate == fulldate &&
        elCourse == course &&
        elTime == time
      )
        target = el.parentNode.children[4].children;
    });
    log(target);
    if (target) {
      target.click();
      setTimeout(funcEnd, 1000);
    } else {
      funcEnd();
    }
  }
  function funcEnd() {
    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      location.href = "/_mobile/login/logout.asp";
    });
  }
})();
