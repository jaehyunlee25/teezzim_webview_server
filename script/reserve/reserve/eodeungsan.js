javascript: (() => {
  ${commonScript}
  const addr = location.href;
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://www.eodeungsancc.com/mobile/reservation_02.asp": funcTime,
    "https://www.eodeungsancc.com/mobile/reservation_03.asp": funcExec,
  };
  const func = dict[addr];
  if (!func) funcMain();
  else func();
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    Date_Click(year, month, date);
  }
  function funcTime() {
    const fulldate = [year, month, date].join("");
    const dictCourse = { 어등: "1", 송정: "2", 하남: "3" };
    Book_Confirm(fulldate, "", dictCourse[course], course, time, "2");
  }
  function funcExec() {
    document.getElementsByClassName("btn_reserve")[0].children[0].click();
    setTimeout(() => {
      const ac = window.AndroidController;
      if (ac) ac.message("end of reserve/reserve");
    }, 10000);
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
    location.href = "logout.asp";
  }
})();
