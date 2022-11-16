function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$btnUpd";
  param["ctl00$contents$htbArgs"] = "CALENDAR|" + dt + "||p";
  param["__EVENTTARGET"] = "ctl00$contents$btnUpd";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/Reservation/Reservation.aspx?rcode=p", param, {}, (data) => {
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
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$btnUpd";
  param["ctl00$contents$htbArgs"] =
    "LIST|" + date.datify() + "|" + date.datify() + "|Y|1|p||";
  param["__EVENTTARGET"] = "ctl00$contents$btnUpd";
  param["__ASYNCPOST"] = "true";
  const dictCourse = {
    44: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:LoginCheck", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("href").inparen();
      let [, date, time, course, sign, , hole, , , , fee_discount, fee_normal] =
        str.split("|");
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
