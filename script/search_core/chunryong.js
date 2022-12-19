function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "javascript:agree_time", true);
  Array.from(els).forEach((el) => {
    const [date, sign] = el.attr("onclick").inparen();
    if (sign != "M") return;
    dates.push([date, sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/booking/booking_02.asp";
  const method = "get";
  const param = {
    bdate: date,
    pub_tp: sign,
  };
  const dictCourse = {
    1: "황룡",
    2: "천룡",
    3: "흑룡",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "javascript:checkAmt", true);
    Array.from(els).forEach((el) => {
      let [, time, course] = el.attr("onclick").inparen();
      course = dictCourse[course];
      const fee = 250000;
      const hole = 18;
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
