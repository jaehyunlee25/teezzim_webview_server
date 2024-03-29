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
  const suffix = location.href.split("?")[1];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const mCourse = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.bavista.co.kr/Mobile/Booking/SelectTime": funcTime,
    "https://www.bavista.co.kr/Mobile/Booking/GolfProgress": funcExec,
    "https://www.bavista.co.kr/Mobile": funcMain,
  };
  const func = dict[addr];
  const dictCourse = {
    Buona: "66",
    Hopark: "77",
    Lago: "33",
    Bella: "22",
    Monti: "11",
  };
  const fulldate = [year, month, date].join("");
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcMain() {
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcReserve() {

    if(suffix == "coGubun=P")  funcDate();

    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    location.href = "${searchUrl}?coGubun=P";
  }
  function funcDate() {

    const tag = localStorage.getItem("TZ_Date");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_Date", new Date().getTime());

    TZLOG(logParam, (data) => {
      reservation(fulldate, "reserv");
    });
  }
  function funcTime() {
    const els = document
      .getElementsByClassName("tbl02")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    let target;
    Array.from(els).forEach((el) => {
      const param = el.children[4].children[0]
        .getAttribute("onclick")
        .inparen();
      const elDate = param[1];
      const elCourse = el.children[0].innerText;
      const elTime = el.children[1].innerText.getFee().toString().gt(4);
      log(elDate, elCourse, elTime);
      log(elDate == fulldate, elCourse, mCourse, elTime == time);
      if (elDate == fulldate && elCourse == mCourse && elTime == time)
        target = el.getElementsByTagName("a")[0];
    });
    if (target) target.click();
  }
  function funcExec() {
    const strEnd = "end of reserve/reserve";
    setTimeout(() => {
      logParam.message = strEnd;
      TZLOG(logParam, (data) => {});
      if (ac) ac.message(strEnd);
      location.href = "/Mobile/Member/Logout";
    }, 1000);
  }
})();
