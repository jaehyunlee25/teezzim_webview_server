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
    const tag = localStorage.getItem("TZ_RESERVE") * 1;    
    if(tag && (new Date().getTime() - tag) < 1000 * 5) return;
    
    TZLOG(logParam, (data) => {
      localStorage.setItem("TZ_RESERVE", new Date().getTime());
      location.href = "/BookingAdd.aspx?Date=" + fulldate;
    });
  }
  function funcDiv() {
    log("funcDiv");
    localStorage.removeItem("TZ_RESERVE");
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
    const tag = localStorage.getItem("TZ_TIME");
    if(tag == "true") return;
    const dictCourse = {
      In: "1",
      Out: "2",
    };
    const fd = [year.ch(2), month, date].join("");
    const key = [fd, time, dictCourse[course]].join("");
    let target = window[key];
    if (target) {
      localStorage.setItem("TZ_TIME", "true");
      target.click();
    } else {
      localStorage.clear();
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/reserve");
    }
  }
  function funcExec() {
    log("funcExec");
    localStorage.removeItem("TZ_TIME");
    const strEnd = "end of reserve/reserve";
    btn_Save.click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      localStorage.clear();
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      localStorage.setItem("TZ_LOGOUT", "true");
    }, 1000);
  }
})();
