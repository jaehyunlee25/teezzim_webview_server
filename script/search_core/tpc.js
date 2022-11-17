function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "show_index_timeTable", true);
  Array.from(els).forEach((el) => {
    const [date, sign] = el.attr("onclick").inparen();
    dates.push([date.rm("-"), sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Reservation/Inc/TimeTable_Amt.asp";
  const method = "post";
  const param = {
    str_date: date.datify(),
    str_dd: sign,
  };
  const dictCourse = {
    1: "Lunar",
    2: "Solar",
    3: "Stellar",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "frm_submit", true);
    Array.from(els).forEach((el) => {
      let [, course, time, sign, hole] = el.attr("onclick").inparen();
      time = time.rm(":");
      course = dictCourse[course];
      const fee = el.nm(0, 4).str().rm(",") * 1;
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
setTimeout(() => {
mneCall(thisdate, procDate);
}, 500);

