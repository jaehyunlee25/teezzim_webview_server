function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "goSend", true);
  Array.from(els).forEach((el) => {
    const [, date, sign, gb] = el.attr("onclick").inparen();
    dates.push([date, sign, gb]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/_mobile/golfRes/real_timeList.asp";
  const method = "post";
  const param = {
    pointdate: date,
    openyn: sign,
    dategbn: gb,
  };
  const dictCourse = {
    1: "Sun",
    2: "Point",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:goSend", true);
    Array.from(els).forEach((el) => {
      let [, course, time] = el.attr("href").inparen(true);
      course = dictCourse[course];
      hole = el.nm(2, 2).str().trim().ct(1);
      const fee = el.nm(2, 3).str().ct(1).rm(",") * 1;
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
