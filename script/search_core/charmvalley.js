function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "401",
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const els = JSON.parse(data).rows;
    els.forEach((el) => {
      if (el.BK_TEAM === 0) return;
      const fulldate = el.CL_SOLAR;
      dates.push([fulldate, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    퀸즈: "Queens",
    밸리: "Valley",
  };
  const param = {
    method: "getTeeList",
    coDiv: "401",
    date: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const els = JSON.parse(data).rows;
    els.forEach((el, i) => {
      const course = dictCourse[el.BK_COS_NM];
      const time = el.BK_TIME;
      let fee_normal = 190000;
      let fee_discount = 190000;

      if (isNaN(fee_normal)) fee_normal = -1;
      if (isNaN(fee_discount)) fee_discount = -1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "18홀",
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
