function mneCall(date, callback) {
  const els = doc.gcn("day-work");
  Array.from(els).forEach((el) => {
    const date = el.attr("data-date");
    const sign = el.attr("data-wc_div");
    dates.push([date, sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {};
  const dictCourse = {
    A: "단일",
  };

  get("/booking/time/" + date, param, {}, (data) => {
    const els = JSON.parse(data);
    Array.from(els).forEach((el) => {
      let {
        bk_cours,
        bk_green_fee: fee_normal,
        bk_hole: hole,
        bk_time: time,
      } = el;
      const course = dictCourse[bk_cours];
      fee_normal = fee_normal.rm(",") * 1;
      const fee_discount = fee_normal;
      hole = hole + "홀";

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
mneCall(thisdate, procDate);
