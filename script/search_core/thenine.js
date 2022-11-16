function mneCall(date, callback) {
  const els = doc.body.gba("href", "JavaScript:Date_Click", true);
  Array.from(els).forEach((el) => {
    const [year, month, date] = el.attr("href").inparen();
    dates.push([[year, month, date].join(""), ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reservation_02.asp";
  const method = "post";
  const param = {
    book_date: date,
    book_time: "",
    book_crs: "",
    book_cnt: "",
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr
      .gba("id", "menu1")[0]
      .gba("onclick", "JavaScript:goSend", true);
    Array.from(els).forEach((el) => {
      let [, date, course, , time] = el.attr("onclick").inparen();
      course = dictCourse[course];
      hole = el.nm(1) == el.nm(2, 4) || el.nm(2, 5) ? 9 : 18;
      const fee = 100000;
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
mneCall(thisdate, procDate);
