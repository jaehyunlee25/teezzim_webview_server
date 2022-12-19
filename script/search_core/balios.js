function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "javascript:transDate", true);
  Array.from(els).forEach((el) => {
    const [date] = el.attr("onclick").inparen();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/04sub_01.asp";
  const method = "post";
  const param = {
    submitDate: date,
  };
  const dictCourse = {
    D: "서",
    A: "동",
    E: "남",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "JavaScript:onclick=bookProsecc", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, , hole] = el.attr("onclick").inparen();
      course = dictCourse[course];
      const fee = 210000;
      hole = hole.ct(1);
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