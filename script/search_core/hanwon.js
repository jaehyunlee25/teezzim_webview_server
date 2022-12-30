function mneCall(date, callback) {
  const param = {
    strYY: date.gh(4),
    strMM: date.gt(2) * 1 + "",
    strReserveType: "1",
    strReserveDate: "",
    strReserveTime: "",
    strCourseCode: "",
    strDayGubun: "",
    strHole: "",
    strSeq: "",
    strBu: "",
    strTotalCnt: "",
    strPrevDL: "",
    strPrevTD: "",
    strPrevReserveType: "",
    dtmChangeDate: "",
    strChangeTime: "",
    strChangeSeq: "",
    strChangeDayGubun: "",
    strChangeCourseCode: "",
    strChangeHole: "",
  };
  post("/mobile/reservation/Reservation01.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "href";
    const els = ifr.gba(attr, "javascript:GetReserveTime", true);
    Array.from(els).forEach((el) => {
      const [, date, sign] = el.attr(attr).inparen();
      dates.push([date.rm("-"), sign]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reservation/Reservation02.asp";
  const method = "post";
  const param = {
    strYY: date.gh(4),
    strMM: date.ch(4).gh(2),
    strReserveType: "1",
    strReserveDate: date.datify(),
    strReserveTime: "",
    strCourseCode: "",
    strDayGubun: sign,
    strHole: "",
    strSeq: "",
    strBu: "",
    strTotalCnt: "",
    strPrevDL: "",
    strPrevTD: "",
    strPrevReserveType: "1",
    dtmChangeDate: "",
    strChangeTime: "",
    strChangeSeq: "",
    strChangeDayGubun: "",
    strChangeCourseCode: "",
    strChangeHole: "",
  };
  const dictCourse = {
    11: "고구려",
    22: "백제",
    33: "신라",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "javascript:ReserveOK", true);
    Array.from(els).forEach((el) => {
      let [, course, time, , , hole] = el.attr(attr).inparen();
      course = dictCourse[course];
      const fee_normal = el.nm(1, 2).str().rm(",") * 1;
      const fee_discount = el.nm(1, 4).str().rm(",") * 1;

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