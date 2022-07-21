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
    "${searchUrl}": funcReserve,
  };
  const func = dict[addr];
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    if (coPlace.innerText != "금가면") {
      changeCoDiv("71");
    }
    const param = {
      type: "command",
      sub_type: "reserve/reserve",
      device_id: "${deviceId}",
      device_token: "${deviceToken}",
      golf_club_id: "${golfClubId}",
      message: "start reserve/reserve",
      parameter: JSON.stringify({}),
    };
    TZLOG(param, (data) => {
      setTimeout(funcDate, 3000);
    });
  }
  function funcDate() {
    const fulldate = [year, month, date].join("");
    onClickDay(fulldate);
    setTimeout(funcTime, 3000);
  }
  function funcTime() {
    const els = window["time-grid"].children;
    const dictCourse = {
      Pine: "PINE",
      Lake: "LAKE",
    };
    let target;
    Array.from(els).forEach((el) => {
      if (el.children.length < 2) return;
      const elCourse = el.children[0].innerText;
      const elTime = el.children[1].innerText.split(":").join("");
      if (dictCourse[course] == elCourse && time == elTime) target = el;
    });
    if (target) {
      target.children[5].children[0].click();
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/reserve");
      doLogout();
    }
  }
})();
