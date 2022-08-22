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
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const day = week[new Date([year, month, date].join("/")).getDay()];
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.baystars.co.kr/mobile/reservation_02.asp": funcTime,
    "https://www.baystars.co.kr/mobile/reservation_03.asp": funcExec,
  };
  const func = dict[addr];
  const dictCourse = {
    Bay: "1",
    Stars: "2",
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
      Date_Click("B", fulldate);
    });
  }
  function funcTime() {
    Book_Confirm(
      fulldate,
      day,
      dictCourse[course],
      course.toUpperCase(),
      time,
      "1",
      ""
    );
    return;
    const fd = [year, month, date].join("");
    const sign = dictCourse[course];
    const els = document.getElementsByClassName("reserv_btn");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      if (param[0] == fd && param[1] == sign && param[2] == time) target = el;
    });
    if (target) target.click();
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    document.getElementsByClassName("btn_reserve")[0].children[0].click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      location.href = "logout.asp";
    }, 1000);
  }
})();
