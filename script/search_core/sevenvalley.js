function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$ScrptManager1"] =
    "ctl00$ContentPlaceHolder1$ScrptManager1|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$htbArgs"] = "CALENDAR|" + dt + "|" + dt;
  param["strReserveType"] = "1";
  param["strClubCode"] = "M";
  param["strVIPType"] = "N";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("href", "javascript:Update", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("href").inparen();
      const [, , date, , sign] = str.split("|");
      dates.push([date.rm("-"), sign]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Mobile/Reservation/Reservation.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$ScrptManager1"] =
    "ctl00$ContentPlaceHolder1$ScrptManager1|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "LIST|" + date.datify() + " 오전 12:00:00|" + date.datify() + "|Y|" + sign;
  param["strReserveType"] = "1";
  param["strClubCode"] = "M";
  param["strVIPType"] = "N";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["__ASYNCPOST"] = "true";
  const dictCourse = {
    11: "세븐",
    22: "밸리",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, , sign] = el.attr("href").inparen();
      date = date.rm("-");
      course = dictCourse[course];
      const hole = el.nm(2, 2).str().split("/")[0].ct(1);
      const fee = el.nm(2, 4).str().rm(",") * 1;
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
