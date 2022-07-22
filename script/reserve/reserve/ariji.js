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
    "https://m.ariji.co.kr:444/membership/booking/time_list.asp": funcTime,
  };
  const func = dict[addr];
  const fulldate = [year, month, date].join("");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag == "true") {
      localStorage.removeItem("TZ_LOGOUT");
      return;
    }
    TZLOG(logParam, (data) => {
      now_calendar.goSend(now_calendar.frmSend, fulldate, "1", "2");
    });
  }
  function funcTime() {
    const strEnd = "end of reserve/reserve";
    localStorage.setItem("TZ_LOGOUT", "true");
    goSend(frmSend, "1", time, course, "ABLE", "N", "210000");
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      location.href = "/login/logout.asp";
    }, 1000);
  }
})();
