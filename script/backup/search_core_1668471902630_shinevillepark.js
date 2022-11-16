function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  const num = date == thisdate ? 0 : 1;
  post("/mobile/inc/calendar.asp?cal_month=" + num, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "javascript:timeList", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("onClick").inparen();
      const date = str.split("=")[1];
      dates.push([date, str]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = sign;
  const method = "post";
  const param = {};
  const dictCourse = {
    A: "River",
    B: "Palm",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "popupOpen", true);
    Array.from(els).forEach((el) => {
      let [, date, time, course] = el.attr("onclick").inparen();
      course = dictCourse[course];
      hole = el.nm(2, 2).str();
      fee_normal = 140000;
      fee_discount = 140000;

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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
