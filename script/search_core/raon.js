function mneCall(date, callback) {
  const param = {
    ThisDate: date,
  };
  post("/mobile_web/reservation_01.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Date_Click", true);
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
  const [date, sign] = arrDate;
  const addr = "/mobile_web/reservation_02.asp";
  const method = "post";
  const param = {
    book_date: date,
  };
  const dictCourse = {
    1: "stone",
    2: "lake",
    3: "pine",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "Date_time", true);
    Array.from(els).forEach((el) => {
      let [date, time, course] = el.attr("onclick").inparen();
      const tr = el.nm(2);
      course = dictCourse[course];
      const hole = el.str().ct(3);
      const fee = tr.nm(0, 1).str().rm(",") * 1;
      const fee_normal = fee;
      const fee_discount = fee;

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