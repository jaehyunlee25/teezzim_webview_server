function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$ContentPlaceHolder1$htbArgs"] = "NEXT|" + dt + "|";
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  post("/Mobile/", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("href", "javascript:location.href", true);
    Array.from(els).forEach((el) => {
      const str = el.attr("href");
      const date = str.split("?")[1].split("=")[1].rm("-").ct(2);
      dates.push([date, ""]);
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
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "LIST|" + date.datify() + "|" + date.datify() + "|Y|||";
  param["strReserveType"] = "1";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["__ASYNCPOST"] = true;
  const dictCourse = {
    11: "서산",
    22: "산수",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, sign, , hole, , ,] = el.attr("href").inparen();
      date = date.rm("-");
      course = dictCourse[course];
      fee_normal = 140000;
      fee_discount = 140000;

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
