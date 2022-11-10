function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "660",
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
    coDiv: "660",
    date,
  };
  const dictCourse = { A: "Pampas", B: "Valley" };

  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    json.rows.forEach((el) => {
      const course = dictCourse[el.BK_COS];
      const time = el.BK_TIME;
      const fee_normal = el.BK_CHARGE.rm(",");
      const fee_discount = el.BK_CHARGE.rm(",");
      const hole = el.BK_ROUNDF_NM;
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
