function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "944",
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const els = JSON.parse(data).rows;
    Array.from(els).forEach((el) => {
      if (el.BK_TEAM === 0) return;
      dates.push([el.CL_SOLAR, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    A: "Dragon",
    B: "Lake",
    C: "Sky",
  };
  const param = {
    method: "getTeeList",
    coDiv: "944",
    date: date,
    cos: "",
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const els = JSON.parse(data).rows;
    Array.from(els).forEach((el, i) => {
      const course = dictCourse[el.BK_COS];
      const time = el.BK_TIME;
      let fee_normal = el.BK_CHARGE_NM.getFee();
      let fee_discount = el.BK_CHARGE_NM.getFee();

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
