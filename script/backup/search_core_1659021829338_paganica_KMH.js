function mneCall(year, callback) {
  const param = {};
  const els = document.getElementsByClassName("can");
  Array.from(els).forEach((el) => {
    const href = el.getAttribute("href");
    const m = el.innerText.split("/")[0].addzero();
    const d = el.innerText.split("/")[1];
    const date = year + m + d;
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {
    strReserveDate: date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2),
    strGolfLgubun: 120,
  };

  get("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("can");
    Array.from(els).forEach((el, i) => {
      const param = el.attr("href").inparen();
        let [, time, course, , , , , , , fee_discount] = param;
        const dictCourse = {
          11: 힐,
          22: 포레스트,
        };
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
mneCall(thisyear, procDate);
