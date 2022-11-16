function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  get("/mobile/reservation_01.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "JavaScript:Date_Click", true);
    Array.from(els).forEach((el) => {
      const [year, month, date] = el.attr("href").inparen();
      dates.push([[year, month, date].join(""), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reservation_02.asp";
  const method = "post";
  const param = {
    book_date_bd: date,
    book_date_be: "",
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [date, course, time] = el.attr("onclick").inparen(true);
      course = dictCourse[course];
      hole = 18;
      const fee = el.nm(2, 1).str().ct(1).rm(",") * 1;
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
