function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    clickTdId: "",
    clickTdClass: "",
    workMonth: date,
    workDate: dt,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    selfTYn: "",
    temp001: "",
    bookgComment: "",
    memberCd: "w1",
    temp007: "",
    agencyReservationYn: "N",
    advanceResGubun: "",
    agreeYn: "Y",
    agreeJoinYn: "Y",
  };
  post("/reservation/ajax/golfCalendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "clickCal", true);
    Array.from(els).forEach((el) => {
      const [, , date, opt] = el.attr("onclick").inparen();
      if (opt != "OPEN") return;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/reservation/ajax/golfTimeList";
  const method = "post";
  const param = {
    clickTdId: "A" + date,
    clickTdClass: "",
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    selfTYn: "",
    temp001: "",
    bookgComment: "",
    memberCd: "w1",
    temp007: "",
    agencyReservationYn: "N",
    advanceResGubun: "",
    agreeYn: "Y",
    agreeJoinYn: "Y",
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("onclick", "golfConfirm", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, , , hole] = el.attr("onclick").inparen();
      hole = hole.ct(1) * 1;
      course = dictCourse[course];
      const fee = 80000;
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