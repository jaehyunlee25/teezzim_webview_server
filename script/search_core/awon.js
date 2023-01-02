function mneCall(date, callback) {
  const param = {
    month: date.gh(4) + "-" + date.gt(2),
  };
  get("/mob/reservation_mobile.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "reservation_mobile02.asp?", true);
    els.forEach((el) => {
      const { date } = el.attr(attr).gup();
      dates.push([date.rm("-"), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mob/reservation_mobile02.asp";
  const method = "get";
  const param = {
    date: date.datify(),
  };
  const dictCourse = {
    A: "West",
    B: "South",
    C: "East",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "jjim_chk", true);
    Array.from(els).forEach((el) => {
      let [date, course, time, hole] = el.attr(attr).inparen();
      course = dictCourse[course];
      const fee_normal = 190000;
      const fee_discount = 190000;

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
