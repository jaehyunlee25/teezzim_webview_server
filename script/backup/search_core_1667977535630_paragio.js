function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["scManager"] = "scManager|btnUp";
  param["__EVENTTARGET"] = "btnUp";
  param["htbArgs"] = "NEXT|" + dt + "|" + dt + "";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      const [opt, date, sign] = el.attr("href").inparen();
      if (opt) return;
      dates.push([date, sign]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/Mobile/Reservation/ReservationTimeList.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["Choice_Date"] = date.datify();
  param["Day_Gubun"] = sign;
  param["htbArgs"] = "";
  const dictCourse = {
    11: "LAKE",
    22: "HILL",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:ReserveCheck", true);
    Array.from(els).forEach((el) => {
      let [date, course, time, , , hole, sign, fee_normal, fee_discount] = el
        .attr("href")
        .inparen();
      course = dictCourse[course];
      fee_normal *= 1;
      fee_discount *= 1;

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