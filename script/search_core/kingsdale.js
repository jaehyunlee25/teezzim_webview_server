function mneCall(date, callback) {
  const els = doc.body.gba("href", "javascript:goSend", true);
  Array.from(els).forEach((el) => {
    const [, date, sign] = el.attr("href").inparen();
    dates.push([date, sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    pointdate: date,
    openyn: num,
    dategbn: "",
  };
  const dictCourse = {
    Lake: "Lake",
    Hill: "Hill",
  };

  post("/_mobile/golfRes/real_timeList.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("href", "javascript:goSend", true);
    Array.from(els).forEach((el) => {
      let [, , time, course, hole, fee] = el.attr("href").inparen();
      course = dictCourse[course];
      fee_normal = fee * 1;
      fee_discount = fee * 1;

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
