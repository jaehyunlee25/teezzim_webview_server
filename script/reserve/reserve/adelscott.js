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
    });
    const fulldate = [year, month, date].join("");
    timefrom_change(fulldate,'2','1','','00','T');
  }
})();
