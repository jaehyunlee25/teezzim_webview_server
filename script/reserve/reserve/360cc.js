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
    "http://www.360cc.co.kr/mobile/main/mainPage.do": funcEnd,
  };
  const func = dict[addr];
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());
    
    ${loginScript}
  }
  function funcReserve() {
    const fulldate = [year, month, date].join("");
    const dictCourse = { Out: "OUT", In: "IN" };
    const signCourse = { Out: "1", In: "2" };
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
      log(data);
    });
    timefrom_change(fulldate, "2", "1", "", "00", "T");
    const t = setInterval(() => {
      if (tab0) {
        timeapply_subcmd(
          "R",
          signCourse[course],
          time,
          "I",
          "UNABLE",
          "",
          "N",
          "N",
          "",
          "",
          dictCourse[course],
          "18홀",
          "140,000",
          "1"
        );
        clearInterval(t);
        funcExec();
      }
    }, 1000);
  }
  function funcExec() {
    const t = setInterval(() => {
      if (agree_chk) {
        agree_chk.checked = true;
        golfsubcmd("R");
        clearInterval(t);
        const param = {
          type: "command",
          sub_type: "reserve/reserve",
          device_id: "${deviceId}",
          device_token: "${deviceToken}",
          golf_club_id: "${golfClubId}",
          message: "end of reserve/reserve",
          parameter: JSON.stringify({}),
        };
        TZLOG(param, (data) => {
          const ac = window.AndroidController;
          if (ac) ac.message("end of reserve/reserve");
          window["mm-m0-p0"].getElementsByTagName("a")[1].click();
        });
      }
    });
  }
})();
