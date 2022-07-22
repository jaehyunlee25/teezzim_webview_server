javascript: (() => {
  //${commonScript}
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
    "https://basecc.co.kr/Mobile/Reservation/Reservation.aspx": funcTime,
    "https://www.beaconhills.co.kr/Mobile/Reservation/ReservationCheck.aspx":
      funcExec,
  };
  const func = dict[addr];
  const dictCourse = {
    누리: "11",
    하늘: "22",
  };
  const fulldate = [year, month, date].join("-");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    //${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      location.href =
        "/Mobile/Reservation/Reservation.aspx?SelDate=" + fulldate;
    });
  }
  function funcTime() {
    const sign = dictCourse[course];
    const els = document.getElementsByClassName("revBtn");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      if (param[0] == fulldate && param[1] == time && param[2] == sign)
        target = el;
    });
    if (target) target.click();
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    ctl00_ContentPlaceHolder1_lbtOK.click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      ctl00_ContentPlaceHolder1_lbtOK.click();
    }, 1000);
  }
})();
