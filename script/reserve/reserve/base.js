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
    "https://basecc.co.kr/Mobile/Reservation/ReservationTimeList.aspx":
      funcTime,
  };
  const func = dict[addr];
  const dictCourse = {
    In: "22",
    Out: "11",
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
      Reserve("", fulldate, "1", "");
    });
  }
  function funcTime() {
    const fd = [year, month, date].join("");
    const sign = dictCourse[course];
    ReserveCheck(fd, sign, time, "00001", "1", "18", "1", "", "");
    setTimeout(funcExec, 1000);
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    ctl00_ContentPlaceHolder1_lbtCancel.click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      location.href = "/_mobile/login/logout.asp";
    }, 1000);
  }
})();
