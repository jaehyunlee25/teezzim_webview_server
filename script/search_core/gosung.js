function mneCall(date, callback) {
  const els = doc.gcn("possible");
  Array.from(els).forEach((el) => {
    const date = el.attr("onclick").inparen()[0];
    dates.push([date, ""]);
  });
  callback();
}
/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    submitDate: date,
  };
  const dictCourse = { 1: "단일" };

  post("/mobile/01reservation/reservation_time.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("reserTable")[1].gtn("a");
    Array.from(els).forEach((el) => {
      const param = el.attr("href").inparen();
      const course = dictCourse[1];
      const [, time] = param;
      const hole = "9홀";
      const fee_discount = 75000;
      const fee_normal = 110000;

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
