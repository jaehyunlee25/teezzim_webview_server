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
    "${searchUrl}": funcReserve,
    "https://www.alpsdy.com/Mobile/reservation/ReservationTimeList.aspx":
      funcTime,
    "https://www.alpsdy.com/Mobile/reservation/ReservationCheck.aspx": funcExec,
  };
  const func = dict[addr];
  const fulldate = [year, month, date].join("-");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    TZLOG(logParam, (data) => {
      Reserve("", fulldate);
    });
  }
  function funcTime() {
    const els = document.getElementsByClassName("reser_btn2");
    const dictCourse = {
      In: "11",
      Out: "22",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const elCourse = param[2];
      const elTime = param[1];
      if (dictCourse[course] == elCourse && time == elTime) target = el;
    });
    if (target) {
      target.click();
    } else {
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/reserve");
      location.href = "/Mobile/member/LogOut.aspx";
    }
  }
  function funcExec() {
    ctl00_ContentPlaceHolder1_btnOk.click();
    const ac = window.AndroidController;
    if (ac) ac.message("end of reserve/reserve");
    location.href = "/Mobile/member/LogOut.aspx";
  }
})();
