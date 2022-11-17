function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "JavaScript:Date_Click", true);
  Array.from(els).forEach((el) => {
    const [year, month, date] = el.attr("onclick").inparen();
    dates.push([[year, month, date].join(""), ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reserve_step1.asp";
  const method = "get";
  const param = {
    book_date: date,
  };
  const dictCourse = {
    1: "Ocean",
    2: "Valley",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time] = el.attr("onclick").inparen();
      course = dictCourse[course];
      hole = 18;
      const fee = 155000;
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
