javascript: (() => {
  ${commonScript}
  const addr = location.href.split("#")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${searchUrl}": funcReserve,
  };
  const func = dict[addr];
  if (!func) location.href = "${searchUrl}";
  else func();
  function funcLogin() {
    ${loginScript}
  }
  function funcReserve() {
    if (window["tab0"]) {
      const els = tab0.getElementsByTagName("button");
      const fulldate = [year, month, date].join("");
      let target;
      const dictCourse = {
        1: "Mountain",
        2: "Hill",
        3: "Lake",
      };
      Array.from(els).forEach((el) => {
        const param = el.getAttribute("onclick").inparen();
        const signCourse = param[1].trim();
        if (param[2].trim() == time && dictCourse[signCourse] == course)
          target = el;
      });
      if (target) {
        target.click();
      }
    } else if (document.getElementsByClassName("cm_btn default")[0]){
      const btn = document.getElementsByClassName("cm_btn default")[0];
      if (btn) {
        btn.click();
      }
    } else {
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
        const fulldate = [year, month, date].join("");
        timefrom_change(fulldate, "2", "1", "", "00", "T");
        funcTime();
      });
    }
  }  
})();
