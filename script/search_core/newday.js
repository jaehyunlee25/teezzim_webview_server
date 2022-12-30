function mneCall(date, callback) {
  const attr = "onclick";
  const els = doc.gba(attr, "Date_Click", true);
  Array.from(els).forEach((el) => {
    const [date] = el.attr(attr).inparen();
    dates.push([date, ""]);
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
    book_date_a: date,
  };
  const dictCourse = {
    1: "Dream",
    2: "Vision",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time] = el.attr(attr).inparen();
      const hole = 18;
      course = dictCourse[course];
      const fee_normal = 180000;
      const fee_discount = 180000;

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
