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
    "http://www.acrogolf.co.kr/mobile/reserve_step1.asp": funcTime,
    "http://www.acrogolf.co.kr/mobile/reserve_step2.asp": funcExec,
    "http://www.acrogolf.co.kr/mobile/reserveConfirm.asp": funcEnd,
  };
  const func = dict[addr];
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
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
    Date_Click(year, month, date);
  }
  function funcTime() {
    const fulldate = [year, month, date].join("");
    const dictCourse = { 챌린지: "C코스", 스카이: "S코스", 마스터: "M코스" };
    const signCourse = { 챌린지: "1", 스카이: "3", 마스터: "2" };
    Book_time(fulldate, signCourse[course], dictCourse[course], time, "", "");
  }
  function funcEnd() {
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
      location.href = "logout.asp";
    });
  }
  function funcExec() {
    const fulldate = [year, month, date].join("");
    const signCourse = { 챌린지: "1", 스카이: "2", 마스터: "3" };
    Book_Confirm(fulldate, signCourse, "", time, "", "");    
  }
})();
