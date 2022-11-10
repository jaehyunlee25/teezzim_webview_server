function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$lnkBtnUpd";
  param["__EVENTTARGET"] = "ctl00$contents$lnkBtnUpd";
  param["selmulti"] = "언어별선택";
  param["strReserveType"] = "1";
  param["strClubCode"] = "M";
  param["ctl00$contents$htbArgs"] = "CALENDAR|" + dt + "|" + dt + "||0|";
  param["__ASYNCPOST"] = "true";
  post("/Reservation/Reservation.aspx", param, {}, (data) => {
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
  const addr = "/Reservation/Reservation.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$lnkBtnUpd";
  param["__EVENTTARGET"] = "ctl00$contents$lnkBtnUpd";
  param["selmulti"] = "언어별선택";
  param["strReserveType"] = "1";
  param["strClubCode"] = "M";
  param["ctl00$contents$htbArgs"] = str;
  param["__ASYNCPOST"] = "true";
  const dictCourse = {
    11: "서",
    22: "남",
    33: "동",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, sign, , hole] = el.attr("href").inparen();
      date = date.rm("-");
      course = dictCourse[course];
      fee_normal = el.nm(2, 4).str().ct(1).rm(",") * 1;
      fee_discount = el.nm(2, 5).str().ct(1).rm(",") * 1;

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