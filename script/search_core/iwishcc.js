function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "237",
    selYm: date,
    _: "",
  };
  get("/controller/ReservationController.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.rows;
    Array.from(els).forEach((el) => {
      if (el.BK_TEAM == "0") return;
      const date = el.CL_SOLAR;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    method: "getTeeList",
    coDiv: "237",
    date: date,
    cos: "All",
    msNum: "",
  };
  const dictCourse = {
    A: "단일",
  };

  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.rows;
    Array.from(els).forEach((el) => {
      let {
        BK_CHARGE: fee,
        BK_COS: course,
        BK_TIME: time,
        BK_ROUNDF: hole,
      } = el;
      hole = hole == "1" ? "18홀" : "9홀";
      course = dictCourse[course];
      const fee_normal = fee.rm(",") * 1;
      const fee_discount = fee_normal;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
