function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$Content$ScptManager"] =
    "ctl00$Content$ScptManager|ctl00$Content$btnUp";
  param["ctl00$Content$htbArgs"] = "CALENDAR|" + dt + "||";
  param["__EVENTTARGET"] = "ctl00$Content$btnUp";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/Reservation/Reservation", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Update", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("href").inparen();
      let [, , date, , sign, ,] = str.split("|");
      dates.push([date.rm("-"), "'" + str + "'"]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Mobile/Reservation/Reservation";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$Content$ScptManager"] =
    "ctl00$Content$ScptManager|ctl00$Content$btnUp";
  param["ctl00$Content$htbArgs"] = sign;
  param["__EVENTTARGET"] = "ctl00$Content$btnUp";
  param["__ASYNCPOST"] = "true";

  const dictCourse = {
    11: "짐앵A",
    22: "짐앵B",
    33: "짐앵C",
    44: "카일필립스A",
    55: "카일필립스B",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, , , hole, , , , fee_normal, fee_discount] = el
        .attr("href")
        .inparen();
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