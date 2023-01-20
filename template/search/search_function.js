function procDate() {
  const LOG_PRM = {
    LOGID,
    step: "procDate",
  };
  if (lmt === undefined && dates.length == 0) {
    if (COMMAND == "GET_TIME") dates.push(["${TARGET_DATE}", 0]);
  }

  if (COMMAND == "GET_DATE") {
    const golf_date = [];
    dates.forEach(([date]) => {
      EXTZLOG("search", [date, typeof date].join(", "), LOG_PRM);
      golf_date.push(date.datify("-"));
    });
    const acParam = {};
    if (golf_date.length == 0) {
      acParam.command = "NONE_OF_GET_DATE";
    } else {
      acParam.command = "SUCCESS_OF_GET_DATE";
      acParam.content = golf_date;
    }
    if (ac) {
      ac.message(JSON.stringify(acParam));
      lsc();
    }
    return;
  }

  if (COMMAND == "GET_TIME") {
    EXTZLOG(
      "search",
      ["target date", "${TARGET_DATE}", dates.length].join(", "),
      LOG_PRM
    );

    const result = [];
    dates.every((arr) => {
      const [date] = arr;
      if (date == "${TARGET_DATE}") {
        result.push(arr);
        /* return false; */
      }
      return true;
    });
    dates = result;
  }

  if (lmt === undefined) lmt = dates.length - 1;
  const order = lmt - dates.length + 1;
  const arrDate = dates.shift();
  if (arrDate) {
    EXTZLOG(
      "search",
      ["수집하기", order + "/" + lmt, arrDate[0]].join(", "),
      LOG_PRM
    );
    EXTZLOG(
      "search",
      ["TZ_PROGRESS," + order + "," + lmt + "," + arrDate[0]].join(", "),
      LOG_PRM
    );
    mneCallDetail(arrDate);
  } else {
    procGolfSchedule();
  }
}
function procGolfSchedule() {
  const LOG_PRM = {
    LOGID,
    step: "procGolfSchedule",
  };
  golf_schedule.forEach((obj) => {
    obj.golf_course_name = obj.golf_course_id;
    let course_id = courses[obj.golf_course_id];
    if (!course_id && Object.keys(courses).length === 1)
      course_id = courses[Object.keys(courses)[0]];
    obj.golf_course_id = course_id;
    obj.date =
      obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
    if (obj.time.indexOf(":") == -1)
      obj.time = obj.time.gh(2) + ":" + obj.time.gt(2);
  });

  EXTZLOG(
    "search",
    ["golf_schedule", golf_schedule, typeof golf_schedule].join(", "),
    LOG_PRM
  );
  const acParam = {};
  if (golf_schedule.length == 0) {
    EXTZLOG("search", "예약가능한 시간이 없습니다.", LOG_PRM);
    acParam.command = "NONE_OF_GET_SCHEDULE";
  } else {
    acParam.command = "end of procGolfSchedule!";
    acParam.content = golf_schedule;
  }
  if (ac) {
    ac.message(JSON.stringify(acParam));
    lsc();
  }
}
