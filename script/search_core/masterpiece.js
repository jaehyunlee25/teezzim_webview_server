function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$contents$sManager"] =
    "ctl00$contents$sManager|ctl00$contents$btUp";
  param["strReserveType"] = "1";
  param["strClubCode"] = "M";
  param["ctl00$contents$htbArgs"] = "CALENDAR|" + (date + "01").datify() + "|";
  param["__EVENTTARGET"] = "ctl00$contents$btUp";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Update", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("href").inparen();
      const [, , date, , sign] = str.split("|");
      if (!date) return;
      dates.push([date.rm("-"), str]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/Mobile/Reservation/Reservation.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$contents$sManager"] =
    "ctl00$contents$sManager|ctl00$contents$btUp";
  param["strReserveType"] = "1";
  param["strClubCode"] = "M";
  param["ctl00$contents$htbArgs"] = sign;
  param["__EVENTTARGET"] = "ctl00$contents$btUp";
  param["__ASYNCPOST"] = "true";
  const dictCourse = {
    11: "Piece",
    22: "Master",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:LoginCheck", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("href").inparen();
      let [, date, time, course, , , hole] = str.split("|");
      date = date.rm("-");
      const fee = el.nm(2, 2).str().split(" / ");
      course = dictCourse[course];
      const fee_normal = fee[0].rm(",") * 1;
      const fee_discount = fee[1].rm(",") * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "18홀",
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