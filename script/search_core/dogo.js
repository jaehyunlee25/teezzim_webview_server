function mneCall(date, callback) {
  const param = {
    day: (date + "01").datify("/"),
    type: "",
  };
  post("/Mobile/Booking/AjaxCalendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "onclick";
    const els = ifr.gba(attr, "reservation", true);
    Array.from(els).forEach((el) => {
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
  const addr = "/Mobile/Booking/SelectTime";
  const method = "post";
  const param = {
    day: date,
    change_trbm_date: "",
    change_trbm_seq: "",
  };
  const dictCourse = {
    11: "Out",
    22: "In",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "ReservationForm", true);
    Array.from(els).forEach((el) => {
      let [, date, , course, time] = el.attr(attr).inparen();
      course = dictCourse[course];
      hole = 18;
      const fee =
        el
          .nm(2, 0)
          .str()
          .regex(/[0-9,]+원/)[0]
          .ct(1)
          .rm(",") * 1;
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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});