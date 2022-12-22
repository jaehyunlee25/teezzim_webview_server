function mneCall(date, callback) {
  const attr = "href";
  const els = doc.gba(attr, "JavaScript:Date_Click", true);
  Array.from(els).forEach((el) => {
    const dateH = el.nm(5, 0).str().rm(".");
    const dateD = el.str();
    const [sign] = el.attr(attr).inparen();
    dates.push([dateH + dateD, sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/html/reservation/reservation_01.asp";
  const method = "post";
  const param = {
    book_date_bd: sign,
    book_date_be: "",
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };
  const dictCourse = {
    1: "Lake",
    2: "Hill",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [, course, time] = el.attr(attr).inparen();
      const hole = 18;
      course = dictCourse[course];
      const fee_normal = 220000;
      const fee_discount = 220000;

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