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
    "${reserveUrl}": funcReserve,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    TZLOG(logParam, (data) => {
      setTimeout(funcCancel, 1000);
    });
  }
  function funcCancel() {
    const els = resHisListDiv.getElementsByTagName("li");
    const dictCourse = {
      IN: "In",
      OUT: "Out",
    };
    let target;
    Array.from(els).forEach((el) => {
      const button = el.getElementsByTagName("button")[2];
      const param = button.getAttribute("onclick").inparen();
      if (param[0] != "J51") return;

      const elDate = param[1];
      const elTime = param[5];
      const elCourse = param[3];
      console.log("reserve cancel", dictCourse[elCourse], elDate, elTime);
      const fulldate = [year, month, date].join("");
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == course &&
        elTime == time
      )
        target = button;
    });
    if (target) {
      target.click();
      logParam.message = "end of reserve/cancel";
      TZLOG(param, (data) => {
        const ac = window.AndroidController;
        if (ac) ac.message("end of reserve/cancel");
        location.href = "/member/logout";
      });
    }
    /* 3초 후엔 무조건 닫는다 */
    setTimeout(() => {
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/cancel");
      doLogout();
    }, 3000);
  }
})();
