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
    "http://www.aristacc.co.kr/mobile/reservation_02.asp": funcTime,
    "http://www.aristacc.co.kr/mobile/reservation_03.asp": funcExec,
  };
  const func = dict[addr];
  const dictCourse = {};
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
    if(!suffix) return;

    const suffixParam = (() => {
      const result = {};
      suffix.split("&").forEach(item => {
        const dv = item.split("=");
        result[dv[0]] = dv[1];
      });
      return result;
    })();

    if(suffixParam["settype"] == "T") {
      log("calendar");
    }else if(suffixParam["settype"] == "R") {
      log("time");
    }

    TZLOG(logParam, (data) => {
      //timefrom_change(fulldate,'2','1','','00','T')
    });
  }
  function funcTime() {
    subcmd('R','1','0500','OUT', '2022년 8월 14일 (일요일)', '18홀', 'I', 'UNABLE', '170000', '160000', '', '', 'N', 'N', '', 'N', 'N')
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
    Book_ok(fulldate, time, dictCourse[course], "");
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      const ac = window.AndroidController;
      if (ac) ac.message(strEnd);
      location.href = "logout.asp";
    }, 1000);
  }
})();
