function mneCall(date, callback) {
  const param = {
    book_yymm: date,
  };
  get("/mobile/reservation_01.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "JavaScript:Date_Click", true);
    Array.from(els).forEach((el) => {
      const [sign, date] = el.attr(attr).inparen();
      dates.push([date, sign]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/mobile/reservation_02.asp";
  const method = "get";
  const param = {
    proc_div: sign,
    book_yymm: date.ct(2),
    book_date: date,
  };
  const dictCourse = {
    1: "Out",
    2: "In",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time] = el.attr(attr).inparen();
      course = dictCourse[course];
      const fee_normal = 100000;
      const fee_discount = 100000;

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
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});