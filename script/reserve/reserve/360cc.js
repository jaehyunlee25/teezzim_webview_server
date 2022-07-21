javascript:(() => {
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
    };
    const func = dict[addr];    
    if(!func) location.href = "${searchUrl}";
    else func();
    function funcLogin() {
        ${loginScript}
    };
    function funcReserve() {
        const fulldate = [year, month, date].join("");
        const dictCourse = { Out: "OUT", In: "IN" };
        const signCourse = { Out: "1", In: "2" };
        const param = {
            type: "command",
            sub_type: "reserve/reserve",
            device_id: "${deviceId}",
            device_token: "${deviceToken}",
            golf_club_id: "a7fe6b1d-f05e-11ec-a93e-0242ac11000a",
            message: "start reserve/reserve",
            parameter: JSON.stringify({}),
          };
          TZLOG(param, (data) => {
            log(data);
          });
        timefrom_change(fulldate, "2", "1", "", "00", "T");
        const t = setInterval(() => {
          if (tab0) {
            timeapply_subcmd(
              "R",
              signCourse[course],
              time,
              "I",
              "UNABLE",
              "",
              "N",
              "N",
              "",
              "",
              dictCourse[course],
              "18홀",
              "140,000",
              "1"
            );
            clearInterval(t);
            funcExec();
          }
        }, 1000);
      };
      function funcExec() {
        const t = setInterval(() => {
          if (agree_chk) {
            agree_chk.checked = true;
            golfsubcmd("R");
            clearInterval(t);
            const param = {
                type: "command",
                sub_type: "reserve/reserve",
                device_id: "${deviceId}",
                device_token: "${deviceToken}",
                golf_club_id: "a7fe6b1d-f05e-11ec-a93e-0242ac11000a",
                message: "end of reserve/reserve",
                parameter: JSON.stringify({}),
              };
              TZLOG(param, (data) => {
                log(data);
              });
          }
        });
      };
})();