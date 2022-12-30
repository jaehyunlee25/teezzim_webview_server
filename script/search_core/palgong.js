function mneCall(date, callback) {
  const attr = "onclick";
  const els = doc.gba(attr, "JavaScript:Date_Click", true);
  els.forEach((el) => {
    const [sign] = el.attr(attr).inparen();
    const dt = el.children[0].str();
    dates.push([date + dt, sign]);
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
    book_date_re: sign,
  };
  const dictCourse = {
    1: "Out",
    2: "In",
  };
  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "JavaScript:Book_Confirm", true);
    els.forEach((el) => {
      let [, course, time] = el.attr(attr).inparen();
      course = dictCourse[course];
      const hole = 18;
      const fee = 130000;
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
mneCall(thisdate, procDate);