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
    "https://www.cistar.co.kr/view/logout.asp": funcOut,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();

  function funcOut() {
    return;
  }
  function funcLogin() {  
    log("funcLogin");  
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    ${loginScript}
  }
  function funcReserve() {
    log("funcReserve");
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      funcCalendar();
    });
  }
  function funcCalendar() {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().addzero();
    const mDate = new Date(year, new Date().getMonth(), "15");
    mDate.setMonth(mDate.getMonth() + 1);
    const nextMonth = (mDate.getMonth() + 1).toString().addzero();
    const yearNextMonth = mDate.getFullYear().toString();
    const lastDateNextMonth = new Date(
      yearNextMonth,
      nextMonth,
      "00"
    ).getDate();
    const fulldateLastDateNextMonth = [
      yearNextMonth,
      nextMonth,
      lastDateNextMonth,
    ].join("-");

    $("#f_date_to").val(fulldateLastDateNextMonth);
    btnSearchGolf.click();
    setTimeout(funcCancel, 1000);
  }
  function funcCancel() {
    log("funcCancel");
    const els = data_list.getElementsByTagName("tr");
    const dictCourse = {
      시스타18홀: "단일",
    };
    let target;
    Array.from(els).forEach((el) => {
      const param = el.children;
      const elDate = param[2].innerText.split("-").join("");
      const elTime = param[3].innerText.split(":").join("");
      const elCourse = param[1].innerText;
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
        target = el.children[6].getElementsByTagName("a")[0];
    });
    log(target);
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
      location.href = "logout.asp";
    });
  }
})();
