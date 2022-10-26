function procDate() {
  if (lmt === undefined && dates.length == 0) {
    if (COMMAND == "GET_TIME") dates.push(["${TARGET_DATE}", 0]);
  }

  if (COMMAND == "GET_DATE") {
    const golf_date = [];
    dates.forEach(([date]) => {
      logParam.sub_type = "search";
      logParam.message = date;
      logParam.parameter = JSON.stringify({
        clubId,
        date,
        type: typeof date,
      });
      TZLOG(logParam, (data) => {});
      golf_date.push(date.datify("-"));
    });
    /* const param = {
      golf_date,
      golf_club_id: clubId,
      device_id: "${deviceId}",
    };
    log("golf_date", golf_date);
    post(
      OUTER_ADDR_HEADER + "/api/reservation/golfDate",
      param,
      header,
      (data) => {
        const json = JSON.parse(data);
        log(json.message);
      }
    ); */
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
    /* LOGOUT(); */

    return;
  }

  if (COMMAND == "GET_TIME") {
    log("target date", "${TARGET_DATE}", dates.length);

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
  log("golf_schedule");
  log(golf_schedule);
  log(typeof golf_schedule);
  const acParam = {};
  if (golf_schedule.length == 0) {
    log("예약가능한 시간이 없습니다.");
    acParam.command = "NONE_OF_GET_SCHEDULE";
  } else {
    acParam.command = "end of procGolfSchedule!";
    acParam.content = golf_schedule;
  }
  if (ac) {
    ac.message(JSON.stringify(acParam));
    lsc();
  }
  /* LOGOUT(); */
  /* const param = {
    golf_schedule,
    device_id: "${deviceId}",
    golf_club_id: clubId,
  };
  post(addrOuter, param, header, (data) => {});
  const json = JSON.parse(data);
  log(json.message); */
}
/* 
[
  {
    club_id: "5d8163d1-cd85-11ec-a93e-0242ac11000a",
    club: "delphino",
    content: [
      {
        date: "2022-09-28",
        fee_discount: 210000,
        fee_normal: 210000,
        golf_club_id: "5d8163d1-cd85-11ec-a93e-0242ac11000a",
        golf_course_id: "b81cbf25-cd86-11ec-a93e-0242ac11000a",
        in_out: "",
        others: "OUT",
        persons: "",
        time: "07:07",
      },
      {
        date: "2022-09-28",
        fee_discount: 210000,
        fee_normal: 210000,
        golf_club_id: "5d8163d1-cd85-11ec-a93e-0242ac11000a",
        golf_course_id: "b81cc15a-cd86-11ec-a93e-0242ac11000a",
        in_out: "",
        others: "IN",
        persons: "",
        time: "07:07",
      },
    ],
  },
];
 */
