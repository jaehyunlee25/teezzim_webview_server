function mneCall(strdate, callback) {
  const param = {};
  const els = doc.gcn("booking-calendar")[0].gtn("a");
  Array.from(els).forEach((el) => {
    if(el.children[1].str().trim() != "예약") return;
    const date = el.attr("data-date");
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
    const param = {};

    get("/public/booking/time/" + date, param, {}, (data) => {
      const arr = JSON.parse(data);
      arr.forEach((el, i) => {
        const course = "단일";
        const time = el.bk_time;
        const fee_discount = el.bk_greenfee * 1;
        const fee_normal = el.bk_greenfee * 1;

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
      setTimeout(procDate, 1000);
    });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);