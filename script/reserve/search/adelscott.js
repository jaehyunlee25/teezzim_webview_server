javascript: (() => {
  ${commonScript}
  const addr = location.href.split("?")[0];
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "https://www.adelscott.co.kr/index.asp": funcEnd,
  };
  const func = dict[addr];
  if (!func) location.href = "${reserveUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcEnd() {
    const el = document.getElementsByClassName("login_area")[0].children[0];
    if (el.innerText == "로그아웃")
      location.href = "${reserveUrl}";
    const ac = window.AndroidController;
    if (ac) ac.message("end of reserve/search");
  }
  function funcReserve() {
    const els = document
      .getElementsByClassName("cm_time_list_tbl")[0]
      .getElementsByClassName("cm_btn gray");
    const result = [];
    const dictCourse = {
      1: "Mountain",
      2: "Hill",
      3: "Lake",
    };
    Array.from(els).forEach((el) => {
      const [, , date, time, course] = el.getAttribute("onclick").inparen();
      console.log("reserve search", dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
    });
    const param = {
      golf_club_id: "${golfClubId}",
      device_id: "${deviceId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      console.log(data);
      const param = {
        type: "command",
        sub_type: "reserve/search",
        device_id: "${deviceId}",
        device_token: "${deviceToken}",
        golf_club_id: "${golfClubId}",
        message: "end of reserve/search",
        parameter: JSON.stringify({}),
      };
      TZLOG(param, (data) => {
        log(data);

        location.href = "/login/logout.asp";
      });
    });
  }
})();
