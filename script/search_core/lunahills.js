function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "Date_Click", true);
  Array.from(els).forEach((el) => {
    const [sign, date] = el.attr("onclick").inparen();
    if (sign != "B") return;
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
    1: "Oak",
    2: "Birch",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "JavaScript:Book_Confirm", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time, fee] = el.attr("onClick").inparen();
      fee = fee.rm(",") * 1000;
      course = dictCourse[course];
      const fee_discount = fee;
      const fee_normal = fee;

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
mneCall(thisdate, procDate);