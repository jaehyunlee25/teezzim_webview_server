function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["Choice_Date"] = "ctl00$contents$ScptManager|ctl00$contents$btnUpd";
  param["__EVENTTARGET"] = "ctl00$contents$btnUpd";
  param["SelectedDate"] = "";
  param["DayGubun"] = "";
  param["ctl00$contents$hdfParam"] = "CALENDAR|" + (date + "01").datify() + "|";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      const [date] = el.attr("href").inparen();
      dates.push([date.rm("-"), ""]);
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
  param["SelectedDate"] = date.datify();
  param["ctl00$contents$hdfParam"] =
    "CALENDAR|" + (date.ct(2) + "01").datify() + "|";
  const dictCourse = {
    11: "홍단풍",
    22: "청단풍",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, sign, , hole, , , , fee] = el
        .attr("href")
        .inparen();
      date = date.rm("-");
      course = dictCourse[course];
      const fee_normal = fee * 1000;
      const fee_discount = fee * 1000;

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