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
  log("raw addr :: ", location.href);
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
  log("addr", addr);
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();
  function funcLogin() {  
    log("funcLogin");  
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
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
    log("funcCancel");
    const els = document.getElementsByClassName("courseTime");
    const dictCourse = {
      A: "England",
      B: "Scotland",
      C: "Wales",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.innerText;
      let elDate = /[0-9]{2}\/[0-9]{2}/.exec(param)[0].split("/").join("");
      
      let year = new Date().getFullYear();
      const nMonth = new Date().getMonth() + 1;
      const cMonth = elDate.gh(2) * 1;
      if(cMonth < nMonth) year += 1;
      
      elDate = year.toString() + elDate;     
      
      const elTime = /[0-9]{2}\:[0-9]{2}/.exec(param)[0].split(":").join("");
      const elCourse = /[A-Za-z]+/.exec(param)[0];
      console.log("reserve search", elCourse, elDate, elTime);
      const fulldate = [year, month, date].join("");
      log(elDate, fulldate,
        elCourse, course,
        elTime, time);
      if (
        elDate == fulldate &&
        elCourse == course &&
        elTime == time
      )
        target = el.parentNode.children[4].children[0];
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
    log("funcEnd");
    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {
      if (ac) ac.message(strEnd);
      /* location.href = "/_mobile/login/logout.asp"; */
    });
  }
})();
