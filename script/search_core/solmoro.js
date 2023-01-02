function mneCall(date, callback) {
  const param = {
    mode: "mobile",
    day: date.datify("/"),
    type: "",
    changeDate: "",
    changeSeq: "",
  };
  post("/Reservation/AjaxCalendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "reservation", true);
    els.forEach((el) => {
      const [date] = el.attr(attr).inparen();
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Reservation/AjaxTimeList";
  const method = "post";
  const param = {
    mode: "mobile",
    date: date,
    changeDate: "",
    changeSeq: "",
    course: "",
  };
  const dictCourse = {
    1: "Cherry",
    2: "Persimmon",
    3: "Pine",
    4: "Maple",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "javascript:formLayer", true);
    Array.from(els).forEach((el) => {
      const tr = el.nm(2);
      const course = tr.children[0].str();
      const time = tr.children[1].str().regex(/[0-9]{2}:[0-9]{2}/g)[0];
      const hole = tr.children[2].str().ct(1);
      const fee = tr.children[5].str().trim().rm(",") * 1;
      const fee_normal = fee;
      const fee_discount = fee;

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
