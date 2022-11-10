function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "Date_Click", true);
  Array.from(els).forEach((el) => {
    const [, date] = el.attr("onclick").inparen();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/mobile/reserve_step1.asp";
  const method = "get";
  const param = {
    book_date: date,
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time, fee] = el.attr("onClick").inparen();
      course = dictCourse[course];
      fee = fee * 1000;
      const fee_normal = fee;
      const fee_discount = fee;
      const hole = 9;

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