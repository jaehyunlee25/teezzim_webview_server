function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$htbArgs"] = "CALENDAR|" + dt + "|";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("onclick", "location.href=", true);
    Array.from(els).forEach((el) => {
      const str = el.attr("onclick");
      const [, , date] = str.split("=");
      dates.push([date.ct(2), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Mobile/Reservation/Reservation.aspx";
  const method = "get";
  const param = {
    SelectedDate: date,
  };
  const dictCourse = {
    11: "아리아",
    22: "빌리",
    33: "샬롯",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, sign, , hole, , , , fee_normal, fee_discount] =
        el.attr("href").inparen();
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
