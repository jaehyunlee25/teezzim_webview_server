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
  const suffix = location.href.split("#")[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.boryeongbase.co.kr/Mobile/Booking/GolfProgress.aspx": funcExec,
  };
  const func = dict[addr];
  const dictCourse = {
    단일: "11",
  };
  const fulldate = [year, month, date].join("-");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {

    if(localStorage.getItem("TZ_RESERVE") == "true") {
      log("enter TZ_RESERVE");
      localStorage.removeItem("TZ_RESERVE");
      setTimeout(funcTime, 1000);
      return;
    }
    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());    


    TZLOG(logParam, (data) => {
      const first = [year, month, "01"].join("-");
      Update("LIST|" + first + "|" + fulldate + "|N|1|NULL|NULL|NULL|NULL");
      localStorage.setItem("TZ_RESERVE", "true");
    });
  }
  function funcTime() {
    log("enter", "funcTime");
    const sign = dictCourse[course];
    const els = document.getElementsByClassName("reservBtn");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      log(param[0], fulldate, param[1], time, param[2], sign);
      if (param[0] == fulldate && param[1] == time && param[2] == sign)
        target = el;
    });
    log("target", target);
    if (target) target.click();
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    log("funcExec");
    contents_lnkBtnReserveOk.click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      location.href = "/Mobile/Member/LogOut.aspx";
    }, 1000);
  }
})();
