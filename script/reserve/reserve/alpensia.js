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
  };
  const func = dict[addr];
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    TZLOG(logParam, (data) => {
      const fulldate = [year, month, date].join("");
      clickCal("", "A", fulldate, "OPEN");
      setTimeout(funcTime, 1000);
    });
  }
  function funcTime() {
    const els = document
      .getElementsByClassName("tbl demo1")[0]
      .getElementsByTagName("tbody")[0].children;
    const dictCourse = {
      ALPS: "ALPS",
      ASIA: "ASIA",
    };
    let target;
    Array.from(els).forEach((el) => {
      const elCourse = el.children[1].innerText;
      const elTime = el.children[2].innerText.split(":").join("");
      if (dictCourse[course] == elCourse && time == elTime) target = el;
    });
    if (target) {
      target.children[6].children[0].click();
      const cfNum = golfTimeDiv2CertNo.innerText;
      certNoChk.value = cfNum;
      golfSubmit();
      if (ac) ac.message("end of reserve/reserve");
      location.href = "/member/logout";
    }
  }
})();
