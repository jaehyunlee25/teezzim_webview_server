function mneCall(date, callback) {
  const attr = "href";
  const els = doc.gba(attr, "javascript:Reserve", true);
  els.forEach((el) => {
    const [, date, sign, gb] = el.attr(attr).inparen();
    dates.push([date.rm("-"), sign, gb]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Mobile/Reservation/ReservationTimeList.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["strReserveType"] = 1;
  param["strDayGubun"] = sign;
  param["strReserveDate"] = date.datify();
  const dictCourse = {
    11: "백로",
    22: "무학",
    33: "백구",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "javascript:ReserveCheck", true);
    Array.from(els).forEach((el) => {
      let [date, course, time, , , hole] = el.attr(attr).inparen();
      course = dictCourse[course];
      const fee_normal = el.nm(3, 2).str().rm(",") * 1;
      const fee_discount = el.nm(3, 3).str().rm(",") * 1;

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
mneCall(thisdate, procDate);
