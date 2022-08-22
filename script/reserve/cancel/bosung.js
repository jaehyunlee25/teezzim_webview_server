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
    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {

    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      funcCancel();
    });
  }
  function funcCancel() {
    const els = document
    .getElementsByClassName("baseTB")[0]
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");
    const dictCourse = {
      1: "Mountain",
      2: "Lake",
    };
    let target;
    Array.from(els).forEach((el) => {
      if (el.children[4].innerText == "취소불가(예약실문의)") {
        const str = el.children[4].innerHTML;
        const regex = /<button.*button>/g;
        const newStr = regex.exec(str)[0];
        el.children[4].innerHTML = newStr;
      }
      const btn = el.children[4].children[0];

      const param = btn.getAttribute("onclick").inparen();
      const elDate = param[0];
      const elTime = param[3];
      const elCourse = param[1];
      console.log("reserve cancel", dictCourse[elCourse], elDate, elTime);
      const fulldate = [year, month, date].join("");
      log(elDate, fulldate,
        dictCourse[elCourse], course,
        elTime, time);
      if (
        elDate == fulldate &&
        dictCourse[elCourse] == course &&
        elTime == time
      )
        target = el;
    });
    if (target) {
      target.click();
      setTimeout(funcEnd, 1000);
    } else {
      funcEnd();
    }
  }
  function funcEnd() {
    const strEnd = "end of reserve/cancel";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {
      if (ac) ac.message(strEnd);
      location.href = "/Mobile/Member/LogOut.aspx";
    });
  }
})();
