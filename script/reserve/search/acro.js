javascript: (() => {
  //${commonScript}
  const addr = location.href.split("?")[0];
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcReserve,
    "": funcEnd,
  };
  const func = dict[addr];
  if (func) func();
  if (!func) location.href = "${reserveUrl}";
  function funcLogin() {
    //${loginScript}
  }
  function funcEnd() {
    const ac = window.AndroidController;
    if (ac) ac.message("end of reserve/search");
  }
  function funcReserve() {
    const els = document
      .getElementsByClassName("typeA text-center")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("a");
    const result = [];
    const dictCourse = {
      C: "챌린지",
      M: "마스터",
      S: "스카이",
    };
    Array.from(els).forEach((el) => {
      const [date, , course, time] = el.getAttribute("onclick").inparen();
      console.log("reserve search", dictCourse[course], date, time);
      result.push({ date, time, course: dictCourse[course] });
      const param = {
        golf_club_id: "${golfClubId}",
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
        });
        location.href = "logout.asp";
      });
    });
  }
})();
