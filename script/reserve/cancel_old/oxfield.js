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
    if (coName.innerText != "ALLDAY OXFIELD") {
      changeCoDiv("77");
    }    
    TZLOG(logParam, (data) => {
      setTimeout(funcCancel, 3000);
    });
  }
  function funcCancel() {
    const els = window["time-grid"].children;
    const dictCourse = {
      OX: "OX",
      FIELD: "Field",
    };
    let target;
    Array.from(els).forEach((el) => {
      if (el.children.length < 2) return;
      const elDate = "20" + el.children[0].innerText.split("/").join("");
      const elTime = el.children[1].innerText.split(":").join("");
      const elCourse = el.children[2].innerText;
      console.log("reserve cancel", dictCourse[elCourse], date, time);
      const fulldate = [year, month, date].join("");
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == course &&
        elTime == time
      )
        target = el;
    });
    if (target) {
      target.children[6].children[0].click();
      logParam.message = "end of reserve/cancel";
      TZLOG(param, (data) => {
        const ac = window.AndroidController;
        if (ac) ac.message("end of reserve/cancel");
        doLogout();
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
