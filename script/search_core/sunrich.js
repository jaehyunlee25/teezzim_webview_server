function mneCall(date, callback) {
  const els = doc.body.gba("href", "javascript:", true);
  Array.from(els).forEach((el) => {
    const date = el.attr("data-date");
    const sign = el.attr("data-wc_div");
    if (!date) return;
    dates.push([date, sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/booking/time/" + date;
  const method = "get";
  const param = {};
  const dictCourse = {
    A: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json;
    Array.from(els).forEach((el) => {
      let { bk_time: time, bk_hole: hole, bk_cours: course } = el;
      course = dictCourse[course];
      fee_normal = 120000;
      fee_discount = 120000;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole + "홀",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
