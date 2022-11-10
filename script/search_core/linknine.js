function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "Date_Click", true);
  Array.from(els).forEach((el) => {
    const [year, month, date] = el.attr("onclick").inparen();
    const dt = [year, month, date].join("");
    dates.push([dt, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    book_date: date,
  };
  const dictCourse = {
    11: "단일",
  };

  get("/mobile/reserve_step1.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("href", "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [date, , , , time] = el.attr("href").inparen();
      course = dictCourse[11];
      fee_normal = 100000;
      fee_discount = 100000;
      const hole = "18홀";

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
