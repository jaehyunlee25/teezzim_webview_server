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
    "http://www.bellastonecc.com/Mobile/Reservation/ReservationTimeList.aspx":
      funcTime,
    "http://www.bellastonecc.com/Mobile/Reservation/ReservationCheck.aspx":
      funcExec,
  };
  const func = dict[addr];
  const dictCourse = {
    스톤: "11",
    벨라: "22",
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
      Reserve([year, month, "01"].join("-"), fulldate, "3", "1");
    });
  }
  function funcTime() {
    const sign = dictCourse[course];
    const els = document
      .getElementsByClassName("timeTbl")[0]
      .getElementsByTagName("a");
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
    ctl00_ContentPlaceHolder1_btnOk.click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      location.href = "/Mobile/Member/LogOut.aspx";
    }, 1000);
  }
})();
