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
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      funcCancel();
    });
  }
  function funcCancel() {
    const els = document.getElementsByClassName("cancelBtn");
    const dictCourse = {
      11: "스톤",
      22: "벨라",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const elDate = param[0].split("-").join("");
      const elTime = param[1];
      const elCourse = param[2];
      console.log("reserve cancel", dictCourse[elCourse], elDate, elTime);
      const fulldate = [year, month, date].join("");
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == course &&
        elTime == time
      )
        target = el;
    });
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
      if (ac) ac.message(strEnd);
      location.href = "/Mobile/Member/LogOut.aspx";
    });
  }
})();
