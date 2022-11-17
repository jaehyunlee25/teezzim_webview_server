function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$jsManager"] =
    "ctl00$ContentPlaceHolder1$jsManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$htbArgs"] = "CALENDAR|" + dt + "|";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["__ASYNCPOST"] = "true";
  post(
    "/Mobile/Reservation/Reservation.aspx?strLGubun=110&strClubCode=N",
    param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gba("href", "javascript:Update", true);
      Array.from(els).forEach((el) => {
        if (!el.nm(1).attr("title")) return;
        if (el.nm(1).attr("title").indexOf("예약가능") == -1) return;
        const [str] = el.attr("href").inparen();
        const [, , date, , sign] = str.split("|");
        dates.push([date.rm("-"), sign]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr =
    "/Mobile/Reservation/Reservation.aspx?strLGubun=110&strClubCode=N";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$jsManager"] =
    "ctl00$ContentPlaceHolder1$jsManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "LIST|" + date.datify() + "|" + date.datify() + "|N|1|18|";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["__ASYNCPOST"] = "true";
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "Update", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("onclick").inparen();
      let [, date, time, course, sign, , hole, , , , fee_normal, fee_discount] =
        str.split("|");
      date = date.rm("-");
      course = dictCourse[11];
      fee_normal = fee_normal.rm(",") * 1;
      fee_discount = fee_discount.rm(",") * 1;

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
