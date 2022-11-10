function mneCall(date, callback) {
  const param = {
    day: (date + "01").datify("/"),
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
  const [date, sign] = arrDate;
  const addr = "/Mobile/Booking/AjaxGetTime";
  const method = "post";
  const param = {
    day: date,
    change_day: "",
  };
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    let els = ifr.gba("onclick", "ReservationForm", true);
    Array.from(els).forEach((el) => {
      let [, date, , course, time] = el.attr("onclick").inparen();
      course = dictCourse[course];
      const fee_normal = 100000;
      const fee_discount = 100000;
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

    els = ifr.gba("onclick", "alert", true);
    Array.from(els).forEach((el) => {
      const tr = el.nm(2);
      const time = tr.nm(0, 0).str().ch(2).trim().rm(":");
      const course = dictCourse[11];
      const fee_normal = 50000;
      const fee_discount = 50000;
      const hole = 9;

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