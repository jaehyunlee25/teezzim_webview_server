function mneCall(date, callback) {
  const res = {};
  const els = doc.body.gba("onclick", "Date_Click", true);
  Array.from(els).forEach((el, i) => {
    const [year, month, date] = el.attr("onclick").inparen();
    dates.push([[year, month, date].join(""), ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/mobile/reserve01_step1.asp";
  const method = "post";
  const param = {
    book_date: date,
  };
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [date, , , , time] = el.attr("onClick").inparen(true);
      date = date.rm(".");
      course = dictCourse[11];
      const hole = 18;
      fee_normal = 70000;
      fee_discount = 70000;

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
