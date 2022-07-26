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

  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
    "https://m.cppc.co.kr/index.asp": funcMain,
    "https://m.cppc.co.kr/_html/member/logout_ok.asp": funcEnd,
    "https://m.cppc.co.kr/_html/reserve_time.part.asp": funcTime,
    "https://m.cppc.co.kr/_html/reserve_form.asp": funcExec,
    "https://m.cppc.co.kr/_html/reserve_info.asp": funcList,
  };
  const func = dict[addr];
  const dictCourse = {
    단일: "11",
  };
  const fulldate = [year, month, date].join("-");
  if (!func) funcOther();
  else func();

  function funcList() {
    log("funcList");
    funcEnd();
    return;
  }
  function funcLogin() {
    log("funcLogin");

    const tag = localStorage.getItem("TZ_LOGIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGIN", new Date().getTime());

    ${loginScript}
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "${searchUrl}";
  }
  function funcReserve() {
    log("funcReserve");

    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 5) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    check_submit(fulldate);
  }
  function funcTime() {
    log("funcTime");
    const els = doc.gcn("reserve_btn");
    log("els", els, els.length);

    let target;
    Array.from(els).forEach((el) => {
      const param = el.attr("onclick").inparen();
      const elTime = param[3].str().rm(":");
      log(elTime);
      log(elTime == time);
      if (elTime == time) target = el;
    });

    log("target", target);
    if (target) target.click();
    else LOGOUT();
  }
  function funcExec() {
    log("funcExec");
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/reserve";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    pagechange('/_html/member/logout_ok.asp','flip','');
  }
})();
