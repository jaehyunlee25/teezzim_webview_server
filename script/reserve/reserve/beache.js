javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/cancel",
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
    "https://www.beachegolf.com/Mobile/Reservation/ReservationTimeList.aspx":
      funcTime,
    "http://www.beachegolf.com/Mobile/Reservation/ReservationCheck.aspx": funcExec,
  };
  const func = dict[addr];
  const dictCourse = {
    다산: "11",
    베아채: "22",
    장보고: "33",
  };
  const fulldate = [year, month, date].join("-");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      Reserve(fulldate);
    });
  }
  function funcTime() {
    Reserve(fulldate, time,dictCourse[course],'1','00078','18','Y','True','1','135000');
    /* const fd = [year, month, date].join("");
    const sign = dictCourse[course];
    const els = document.getElementsByClassName("reserv_btn");
    let target;
    Array.from(els).forEach(el => {
      const param = el.getAttribute("href").inparen();
      if(param[0] == fd && param[1] == sign && param[2] == time) target = el;
    });
    if(target) target.click(); */
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    ctl00_ContentPlaceHolder1_lbtOK.click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      ctl00_Top_aLogout.click();
    }, 1000);
  }
})();
