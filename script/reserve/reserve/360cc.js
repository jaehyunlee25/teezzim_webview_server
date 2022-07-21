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
          }
        });
      };
})();