function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    ThisDate: date,
    reserv_no: "",
    dong1_name: "",
    telephone2: "",
    bigo: "",
  };
  post("/booking/booking_action.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("title", "예약가능");
    Array.from(els).forEach((el) => {
      const [year, month, date] = el.nm(0, 0).attr("href").inparen();
      dates.push([[year, month, date].join(""), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/booking/booking_action.asp";
  const method = "post";
  const param = {
    book_date: date,
  };
  const dictCourse = {
    1: "Imperial",
    2: "Majesty",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "JavaScript:Book_time", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time, , fee] = el.attr("href").inparen();
      course = dictCourse[course];
      hole = 18;
      fee *= 1;
      fee_normal = fee;
      fee_discount = fee;

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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});