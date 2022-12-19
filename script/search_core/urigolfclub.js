function mneCall(date, callback) {
  const dt = (date + "01").datify("/");
  const param = {
    day: dt,
    type: "",
    change_day: "",
  };
  post("/Mobile/Booking/AjaxCalendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("data-day", "", true);
    Array.from(els).forEach((el) => {
      const date = el.attr("data-day");
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Mobile/Booking/AjaxGetTime";
  const method = "post";
  const param = {
    day: date,
    change_day: "",
    change_linked: "",
  };
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "ReservationForm", true);
    Array.from(els).forEach((el) => {
      let [, date, , course, time] = el.attr("onclick").inparen();
      course = dictCourse[course];
      hole = el.nm(1) == el.nm(2, 2) ? 18 : 9;
      const fee = hole == 18 ? 80000 : 40000;
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