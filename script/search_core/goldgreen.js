function mneCall(date, callback) {
  const param = {
    clickTdId: "",
    clickTdClass: "",
    workMonth: date,
    workDate: date + "01",
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    selfTYn: "",
    temp008: "4",
    agreeYn: "Y",
  };
  post("/reservation/ajax/golfCalendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const btns = ifr.gcn("cal_live");
    Array.from(btns).forEach((btn) => {
      const param = btn.attr("onclick").inparen();
      const [, , date] = param;
      dates.push([date, ""]);
    });
    log(dates);
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
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
    temp008: "4",
    agreeYn: "Y",
  };

  post("/reservation/ajax/golfTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("btn btn-res");
    Array.from(els).forEach((btn) => {
      const param = btn.attr("onclick").inparen();
      const dictCourse = { 1: "단일" };
      let [date, time, course, , , , fee_discount, fee_normal] = param;
      fee_discount *= 1;
      fee_normal *= 1;
      course = dictCourse[course];

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "9홀",
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
