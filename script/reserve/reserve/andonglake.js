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
    "http://m2.gtc.co.kr/BookingAdd.aspx": funcDiv,
  };
  const func = dict[addr];
  const fulldate = [year, month, date].join("-");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    TZLOG(logParam, (data) => {
      location.href = "/BookingAdd.aspx?Date=" + fulldate;
    });
  }
  function funcDiv() {
    log("funcDic");
    const tag = localStorage.getItem("TZ_LOGOUT");
    if(tag == "true") {
      localStorage.removeItem("TZ_LOGOUT");
      return;
    }
    if(Booking_Detail.style.display == "none") funcTime();
    else if(Booking_Detail.style.display == "block") funcExec();
  }
  function funcTime() {
    log("funcTime");
    const dictCourse = {
      In: "1",
      Out: "2",
    };
    const fd = [year.ch(2), month, date].join("");
    const key = [fd, time, dictCourse[course]].join("");
    let target = window[key];
    if (target) {
      target.click();
    } else {
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/reserve");
    }
  }
  function funcExec() {
    log("funcExec");
    const strEnd = "end of reserve/reserve";
    btn_Save.click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      localStorage.setItem("TZ_LOGOUT", "true");
    }, 1000);
  }
})();
