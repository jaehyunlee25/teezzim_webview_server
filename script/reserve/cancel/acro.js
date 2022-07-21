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
    "${reserveUrl}": funcReserve,
    "http://www.acrogolf.co.kr/mobile/index.asp": funcEnd,
  };
  const func = dict[addr];
  if (func) func();
  function funcLogin() {
    ${loginScript}
  }
  function funcEnd() {
    const el = document.getElementsByClassName("btn loginBtn btn-xs")[0];
    if (el.innerText == "로그아웃")
    location.href = "http://www.acrogolf.co.kr/mobile/reserveConfirm.asp";
    return;

    const param = {
      type: "command",
      sub_type: "reserve/cancel",
      device_id: "${deviceId}",
      device_token: "${deviceToken}",
      golf_club_id: "${golfClubId}",
      message: "end of reserve/cancel",
      parameter: JSON.stringify({}),
    };
    TZLOG(param, (data) => {
      log(data);
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/cancel");
      location.href = "logout.asp";
    });  
  }
  function funcReserve() {
    return;
    const els = document
      .getElementsByClassName("typeA text-center")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("a");
    const result = [];
    const dictCourse = {
      1: "챌린지",
      2: "마스터",
      3: "스카이",
    };
    let target;
    Array.from(els).forEach((el) => {
      const [btnDate, , btnCourse, btnTime] = el
        .getAttribute("onclick")
        .inparen();
      console.log("reserve search", dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
      const param = {
        golf_club_id: "df1fffae-ee44-11ec-a93e-0242ac11000a",
        result,
      };
      const fulldate = [year, month, date].join("");
      if (
        btnDate == fulldate &&
        btnCourse == dictCourse[course] &&
        btnTime == time
      )
        target = btn;
    });

    if (target) target.click();

    location.href = "logout.asp";
  }
})();
