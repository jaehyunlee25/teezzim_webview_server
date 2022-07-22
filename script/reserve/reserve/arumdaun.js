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
  const suffix = location.href.split("?")[1];
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
    "http://m2.arumdaunresort.com/include/menu.asp": funcBasic,
    "http://m2.arumdaunresort.com/reserve_02_Book.asp": funcTime,
  };
  const func = dict[addr];
  const dictCourse = {
    Hill: "1",
    Lake: "2",
    Rock: "3",
  };
  const fulldate = [year, month, date].join("");
  //if (!func) location.href = "${searchUrl}";
  if(func) func();
  function funcLogin() {
    ${loginScript}
  }
  function funcBasic() {
    const tag = localStorage.getItem("TZ_BASIC");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      return;
    }
    localStorage.setItem("TZ_BASIC", new Date().getTime());

    location.herf = "${searchUrl}";
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      return;
    }
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    TZLOG(logParam, (data) => {
      Date_Click("B", fulldate);
    });
  }
  function funcTime() {
    if (!suffix) {
      /* Book_Confirm(
        fulldate,
        day,
        dictCourse[course],
        course.toUpperCase(),
        time,
        "210000",
        "N",
        "18홀"
      ); */
      delete dict["http://m2.arumdaunresort.com/reserve_02_Book.asp"];
    }
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
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/reserve");
      localStorage.setItem("TZ_LOGOUT", "true");
      location.href = "/Mobile/member/LogOut.aspx";
    }
    */
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    const cfrmNo = document.getElementsByName("apply_no")[0].value;
    /* document.getElementsByName("apply_no_re")[0].value = cfrmNo;
    document.getElementsByClassName("btn002")[0].click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      checkLogOut();
    }, 1000); */
  }
})();
