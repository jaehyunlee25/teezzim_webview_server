function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$lnkBtnUpd";
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "CALENDAR|" + dt + "|" + dt + "|NULL|NULL|NULL";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$lnkBtnUpd";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/Reservation/ReservationV1.aspx", param, {}, (data) => {
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
  const addr = "/Mobile/Reservation/ReservationV2.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$lnkBtnUpd";
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "LIST|" + date.datify() + "|" + date.datify() + "|Y|1|NULL|NULL|NULL|NULL";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$lnkBtnUpd";
  param["__ASYNCPOST"] = "true";
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "Reserve", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, sign, , hole, , , , fee_discount, , fee_normal] =
        el.attr("onclick").inparen();
      date = date.rm("-");
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
