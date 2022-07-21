javascript: (() => {
  ${commonScript}
  const addr = location.href.split("?")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "https://www.adelscott.co.kr/index.asp": funcEnd,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcEnd() {
    const el = document.getElementsByClassName("login_area")[0].children[0];
    if (el.innerText == "로그아웃") location.href = "${reserveUrl}";
    const ac = window.AndroidController;
    if (ac) ac.message("end of reserve/cancel");
  }
  function funcReserve() {
    const els = document
      .getElementsByClassName("cm_time_list_tbl")[0]
      .getElementsByClassName("cm_btn gray");
    const dictCourse = {
      1: "Mountain",
      2: "Hill",
      3: "Lake",
    };
    let target;
    Array.from(els).forEach((el) => {
      const [, , btnDate, btnTime, btnCourse] = el
        .getAttribute("onclick")
        .inparen();
      console.log("reserve cancel", dictCourse[btnCourse], date, time);
      const fulldate = [year, month, date].join("");
      if (
        btnDate == fulldate &&
        dictCourse[btnCourse] == course &&
        btnTime == time
      )
        target = el;
    });

    if (target) {
      target.click();
      realcmd1("R");
    }

    const param = {
      type: "command",
      sub_type: "reserve/cancel",
      device_id: "${deviceId}",
      device_token: "${deviceToken}",
      golf_club_id: "${golfClubId}",
      message: "end of reserve/cancel",
      parameter: JSON.stringify({}),
    };
    TZLOG(param, (data) => {
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/cancel");
      location.href = "/login/logout.asp";
    });
  }
})();
