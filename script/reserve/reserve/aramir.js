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
  const suffix = location.href.split("?")[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://m.ara-mir.com/Mobile/Reservation/ReservationTimeList.aspx": funcTime,
    "https://m.ara-mir.com/Mobile/Reservation/ReservationCheck.aspx": funcExec,
  };
  const func = dict[addr];
  const fulldate = [year, month, date].join("-");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if(tag == "true") {
      localStorage.removeItem("TZ_LOGOUT");
      return;
    }
    if(!suffix) location.href = location.href + "?ThisDate=" + fulldate;
    TZLOG(logParam, (data) => {
      const els = document.getElementsByClassName("tbl02")[0].getElementsByClassName("r_choice");
      let target;
      Array.from(els).forEach(el => {
        const param = el.getAttribute("data-date");
        if(fulldate == param) target = el;
      });
      if(target) target.click();
    });
  }
  function funcTime() {
    const els = document.getElementsByClassName("reser_btn0");
    const dictCourse = {
      ara_in: "22",
      ara_out: "11",
      mir_in: "44",
      mir_out: "33",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const elCourse = param[1];
      const elTime = param[2];
      if (dictCourse[course] == elCourse && time == elTime) target = el;
    });
    if (target) {
      target.click();
    } else {
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/reserve");
      localStorage.setItem("TZ_LOGOUT", "true");
      location.href = "/Mobile/Member/LogOut.aspx";
    }
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
  }
})();
