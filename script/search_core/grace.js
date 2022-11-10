function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: 202,
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    json.rows.forEach((el) => {
      if (el.BK_TEAM == 0) return;
      dates.push([el.CL_SOLAR, el]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    method: "getTeeList",
    coDiv: "202",
    date,
  };
  const dictCourse = { A: "Valley", B: "Lake", C: "Mountain" };

  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    json.rows.forEach((el) => {
      let { BK_COS: course, BK_DAY: date, BK_TIME: time } = el;
      course = dictCourse[course];
      const fee_discount = 130000;
      const fee_normal = 130000;
      const hole = "9홀";

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
