function mneCall(date, callback) {
  const param = {
    ThisDate: date,
  };
  post("/mobile/reserve.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "JavaScript:Date_Click", true);
    els.forEach((el) => {
      const [year, month, dt] = el.attr(attr).inparen();
      dates.push([[year, month, dt].join(""), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reserve_step1.asp";
  const method = "post";
  const param = {
    book_date_bd: date,
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };
  const dictCourse = {
    1: "가야",
    2: "충무",
    3: "공룡",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onClick";
    const els = ifr.gba(attr, "bookconfirm", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time] = el.attr(attr).inparen();
      hole = 18;
      course = dictCourse[course];
      const fee_normal = 140000;
      const fee_discount = 140000;

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
