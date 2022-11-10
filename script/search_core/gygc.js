function mneCall(date, callback) {
  const els = doc.body.gba("style", "cursor:hand;");
  Array.from(els).forEach((el) => {
    const [date] = el.attr("onclick").inparen();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    submitDate: date,
    Roundf: "",
  };
  const dictCourse = {
    11: "단일",
  };

  post("/03reservation/booking_01_1.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("style", "cursor:hand");
    Array.from(els).forEach((el) => {
      const [date, time] = el.parentNode.attr("href").inparen();
      const course = dictCourse["11"];
      const fee_discount = 50000;
      const fee_normal = 50000;
      hole = "9홀";

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
