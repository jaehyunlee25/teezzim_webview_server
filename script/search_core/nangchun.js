function mneCall(date, callback) {
  const first = date + "01";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$contents$htbArgs"] =
    "CALENDAR|" + first.datify() + "|" + first.datify() + "|NULL|NULL|NULL";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/Booking/ReservationCalendar.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Update", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("href").inparen();
      const [, , date] = str.split("|");
      dates.push([date.rm("-"), str]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/Mobile/Booking/ReservationCalendar.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$contents$htbArgs"] = sign;
  param["__ASYNCPOST"] = "true";
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "Reserve", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, sign, , hole] = el.attr("onclick").inparen();
      date = date.rm("-");
      course = dictCourse[course];
      hole = hole * 1;
      const fee_normal = 50000;
      const fee_discount = 50000;

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