javascript: (() => {
  ${commonScript}
  const logParam = {
    type: "command",
    sub_type: "reserve/search",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "start reserve/search",
    parameter: JSON.stringify({}),
  };
  const addr = location.href.split("?")[0];
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
    setTimeout(funcSearch, 1000);
  }
  function funcSearch() {
    const els = data_list.getElementsByTagName("tr");
    const result = [];
    const dictCourse = {
      시스타18홀: "단일",
    };
    Array.from(els).forEach((el) => {
      const param = el.children;
      const elDate = param[2].innerText.split("-").join("");
      const elTime = param[3].innerText.split(":").join("");
      const elCourse = param[1].innerText;
      console.log("reserve search", dictCourse[elCourse], elDate, elTime);
      result.push({ date: elDate, time: elTime, course: dictCourse[elCourse] });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      console.log(data);
      funcEnd();
    });
  }
  function funcEnd() {
    const strEnd = "end of reserve/search";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
    location.href = "logout.asp";
  }
})();
