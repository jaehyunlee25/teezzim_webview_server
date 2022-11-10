function mneCall(date, callback) {
  const param = {
    day: (date + "01").datify("/"),
    type: "",
  };
  post("/Mobile/Ajax/MobileCalendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "reservation", true);
    Array.from(els).forEach((el) => {
      const [date, opt] = el.attr("onclick").inparen();
      if (opt) return;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/Mobile/Booking/SelectTime";
  const method = "post";
  const param = {
    date,
    type: "",
  };
  const dictCourse = {
    11: "몬테로사",
    22: "빅혼",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "ReservationForm", true);
    Array.from(els).forEach((el) => {
      const tr = el.nm(2);
      let course = tr.attr("data-course");
      let time = tr.nm(0, 0).str().rm(":");
      let fee = tr.nm(0, 2).str().rm(",");
      let [, date] = el.attr("onclick").inparen();
      date = date.rm("-");
      course = dictCourse[course];
      const fee_normal = fee * 1;
      const fee_discount = fee * 1;
      const hole = 18;

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