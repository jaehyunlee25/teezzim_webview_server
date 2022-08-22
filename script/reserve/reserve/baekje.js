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
  const addr = location.href.split("#")[0];
  const suffix = location.href.split("#")[1];
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
  const dictCourse = {
    한성: "1",
    웅진: "2",
    사비: "3",
  };
  const fulldate = [year, month, date].join("");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());
    if (!suffix) return;

    const suffixParam = (() => {
      const result = {};
      suffix.split("&").forEach((item) => {
        const dv = item.split("=");
        result[dv[0]] = dv[1];
      });
      return result;
    })();

    if (suffixParam["settype"] == "R") {
      log("calendar");
      funcDate();
    } else if (suffixParam["settype"] == "T") {
      log("time");
      funcTime();
    }
  }
  function funcDate() {
    TZLOG(logParam, (data) => {
      timefrom_change(fulldate, "1", "6", "", "00", "T");
    });
  }
  function funcTime() {
    const target = window["timeresbtn_" + dictCourse[course] + "_" + time];
    if (target) {
      target.click();
      funcExec();
    } else {
      if (ac) ac.message("end of reserve/reserve");
      location.href = "/login/logout.asp";
    }
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    document.getElementsByClassName("cm_btn default")[0].click();
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      if (ac) ac.message(strEnd);
      location.href = "/_mobile/login/logout.asp";
    }, 1000);
  }
})();
