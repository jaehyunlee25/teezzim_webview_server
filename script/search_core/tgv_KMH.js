function mneCall(date, callback) {
  const param = {};
  const els = document.getElementsByClassName("can");
  Array.from(els).forEach((el) => {
    const href = el.getAttribute("href");
    if (href === "#") return;
    const date = thisdate + el.innerText.addzero();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {
    strReserveDate: date.datify(),
    strGolfLgubun: 113,
  };

  get("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("can");
    Array.from(els).forEach((el, i) => {
      const param = el.attr("href").inparen();
        let [, time, course, , , , , , , fee_discount] = param;
        const dictCourse = { 11: "단일" };

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
  Update("CALENDAR|" + (nextdate + "01").datify() + "|");
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 1500);
});
