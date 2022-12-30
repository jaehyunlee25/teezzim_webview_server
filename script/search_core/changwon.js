function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "CALENDAR|" + (date + "01").datify() + "|";
  param["strReserveType"] = "1";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/Reservation/CyberReserv.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "javascript:Update", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr(attr).inparen();
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
  const addr = "/Mobile/Reservation/CyberReservTime.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "CALENDAR|" + (date.ct(2) + "01").datify() + "|";
  param["strReserveDate"] = date.datify();
  param["strReserveType"] = "1";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["__ASYNCPOST"] = "true";
  const dictCourse = {
    11: "서코스",
    22: "동코스",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      let [, time, course, , , hole, , , , fee_discount, fee_normal] = el
        .attr(attr)
        .inparen();
      course = dictCourse[course];

      fee_discount *= 1;
      fee_normal *= 1;

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