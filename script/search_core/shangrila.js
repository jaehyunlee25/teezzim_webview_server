function mneCall(date, callback) {
  const els = doc.body.gba("onClick", "Date_Click", true);
  Array.from(els).forEach((el) => {
    const [year, month, date] = el.attr("onClick").inparen();
    dates.push([[year, month, date].join(""), ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/html/reserve/reserve01.asp";
  const method = "post";
  const param = {
    book_date: date,
  };
  const dictCourse = {
    1: "Lake",
    2: "Dream",
    3: "Angel",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "JavaScript:time_Confirm", true);
    Array.from(els).forEach((el) => {
      let [, hole, date, course, , time] = el.attr("onClick").inparen();
      course = dictCourse[course];
      const fee = 130000;
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