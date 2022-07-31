function mneCall(date, callback) {
  const param = {};
  const els = doc.gcn("can");
  Array.from(els).forEach((el) => {
    const href = el.attr("href");
    if (href === "#") return;
    const fulldate = date+ el.str().addzero();
    dates.push([fulldate , ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {
    strReserveDate: date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2),
    strGolfLgubun: 160,
  };

  get("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("cosTable")[0].gtn("tr");
    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const param = el.gtn("a")[0].attr("href").inparen();
        const dictCourse = {
          11: "서",
          22: "남",
          33: "동",
        };
        let [, time, course, , , , , , , fee_discount] = param;
        course = dictCourse[course];
        fee_discount *= 1;
        const fee_normal = fee_discount;

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
  Update("CALENDAR|" + nextyear + "-" + nextmonth + "|");
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 1000);
});
