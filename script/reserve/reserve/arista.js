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
    "http://www.aristacc.co.kr/mobile/reservation_02.asp": funcTime,
    "http://www.aristacc.co.kr/mobile/reservation_03.asp": funcExec,
  };
  const func = dict[addr];
  const dictCourse = {
    Lake: "1",
    Mountain: "2",
  };
  const fulldate = [year, month, date].join("");
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
      Date_Click(year, month, date);
    });
  }
  function funcTime() {
    Book_Confirm(fulldate, dictCourse[course], time, "");
    return;
    /*
    const els = document.getElementsByClassName("reser_btn2");
    const dictCourse = {
      In: "22",
      Out: "11",
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
      if (ac) ac.message("end of reserve/reserve");
      localStorage.setItem("TZ_LOGOUT", "true");
      location.href = "/Mobile/member/LogOut.aspx";
    }
    */
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    Book_ok(fulldate, time, dictCourse[course], "");
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      if (ac) ac.message(strEnd);
      location.href = "logout.asp";
    }, 1000);
  }
})();
