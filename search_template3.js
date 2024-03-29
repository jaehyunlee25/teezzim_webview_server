function procDate() {
  if (lmt === undefined && dates.length == 0) {
    log("예약가능한 시간이 없습니다.");
    if (ac) ac.message(JSON.stringify({ command: "NONE_OF_GET_SCHEDULE" }));
    return;
    return;
  }

  if (COMMAND == "GET_DATE") {
    const golf_date = [];
    dates.forEach(([date]) => {
      log(clubId, "date", date, typeof date);
      golf_date.push(date.datify("-"));
    });
    const param = { golf_date, golf_club_id: clubId };
    post(
      OUTER_ADDR_HEADER + "/api/reservation/golfDate",
      param,
      header,
      (data) => {
        const json = JSON.parse(data);
        log(json.message);
        const acParam = {};
        if (golf_date.length == 0) {
          acParam.command = "NONE_OF_GET_DATE";
        } else {
          if (json.resultCode == 200) {
            acParam.command = "SUCCESS_OF_GET_DATE";
            acParam.content = golf_date;
          } else {
            acParam.command = "FAIL_OF_GET_DATE";
          }
        }
        if (ac) ac.message(JSON.stringify(acParam));
      }
    );
    return;
  }

  if (COMMAND == "GET_TIME") {
    const result = [];
    dates.every((arr) => {
      const [date] = arr;
      if (date == "${TARGET_DATE}") {
        result.push(arr);
        return false;
      }
      return true;
    });
    dates = result;
  }

  if (lmt === undefined) lmt = dates.length - 1;
  const order = lmt - dates.length + 1;
  const arrDate = dates.shift();
  if (arrDate) {
    log("수집하기", order + "/" + lmt, arrDate[0]);
    log("TZ_PROGRESS," + order + "," + lmt + "," + arrDate[0]);
    const param = {
      type: "command",
      sub_type: "search",
      device_id: "${deviceId}",
      device_token: "${deviceToken}",
      golf_club_id: "${golfClubId}",
      message: "search",
      parameter: JSON.stringify({ order, total: lmt, date: arrDate[0] }),
    };
    TZLOG(param, (data) => {});
    mneCallDetail(arrDate);
  } else {
    procGolfSchedule();
  }
}
function procGolfSchedule() {
  golf_schedule.forEach((obj) => {
    let course_id = courses[obj.golf_course_id];
    if (!course_id && Object.keys(courses).length === 1)
      course_id = courses[Object.keys(courses)[0]];
    obj.golf_course_id = course_id;
    obj.date =
      obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
    if (obj.time.indexOf(":") == -1)
      obj.time = obj.time.gh(2) + ":" + obj.time.gt(2);
  });
  /* console.log(golf_schedule); */
  const param = { golf_schedule, golf_club_id: clubId };
  post(addrOuter, param, header, (data) => {
    const json = JSON.parse(data);
    log(json.message);
    const acParam = {};
    if (golf_schedule.length == 0) {
      log("예약가능한 시간이 없습니다.");
      acParam.command = "NONE_OF_GET_SCHEDULE";
    } else {
      if (json.resultCode == 200) {
        acParam.command = "end of procGolfSchedule!";
        acParam.content = golf_schedule;
      } else {
        acParam.command = "FAIL_OF_GET_SCHEDULE";
      }
    }
    if (ac) ac.message(JSON.stringify(acParam));
  });
}
