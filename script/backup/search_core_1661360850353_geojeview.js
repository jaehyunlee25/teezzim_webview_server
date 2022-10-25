function mneCall(date, callback) {
  const els = doc.gcn("day-work");
  Array.from(els).forEach((el) => {
    if (el.str().indexOf("예약") == -1) return;
    const fulldate = el.attr("data-date");
    dates.push([fulldate, 0]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const dictCourse = {
    A: "해돋이",
    B: "해넘이",
  };
  const param = {};
  get("/booking/time/" + date, param, {}, (data) => {
    const els = JSON.parse(data);
    Array.from(els).forEach((el, i) => {
      const course = dictCourse[el.bk_cours];
      const time = el.bk_time;
      let fee_normal = el.bk_green_fee.getFee();
      let fee_discount = el.bk_green_fee.getFee();

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
        others: "9홀",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
