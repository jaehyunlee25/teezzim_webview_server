function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["__EVENTTARGET"] = "ctl00$contents$lnkBtnUpd";
  param["rsvType"] = "1";
  param["clubCode"] = "M";
  param["ctl00$contents$htbArgs"] =
    "CALENDAR|2022-12-01|2022-11-11|NULL|NULL|NULL";
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$lnkBtnUpd";
  post("/Mobile/Booking/GolfCalendar.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Update", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("href").inparen();
      const [, , date, , sign] = str.split("|");
      dates.push([date.rm("-"), sign, str]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, str] = arrDate;
  const addr = "/Mobile/Booking/GolfCalendar.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["rsvType"] = "1";
  param["clubCode"] = "M";
  param["ctl00$contents$htbArgs"] = str;
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$lnkBtnUpd";
  param["__EVENTTARGET"] = "ctl00$contents$lnkBtnUpd";
  const dictCourse = {
    11: "동해",
    22: "태백",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "Reserve", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, sign, , hole, , , , , , fee] = el
        .attr("onclick")
        .inparen(true);
      date = date.rm("-");
      course = dictCourse[course];
      hole = hole;
      fee_normal = fee * 1;
      fee_discount = fee * 1;

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
