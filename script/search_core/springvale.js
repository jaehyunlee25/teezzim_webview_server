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
  const addr = "/01reservation/reservation_time.asp";
  const method = "post";
  const param = {
    submitDate: date,
  };
  const dictCourse = {
    A: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:bookProsecc", true);
    Array.from(els).forEach((el) => {
      let [date, time, course] = el.attr("href").inparen(true);
      course = dictCourse[course];
      hole = el.nm(1) == el.nm(2, 3) ? 9 : 18;
      fee_normal = 90000;
      fee_discount = 90000;

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
