function mneCall(date, callback) {
  const els = doc.body.gba("href", "javascript:goReservTime", true);
  Array.from(els).forEach((el) => {
    const [date] = el.attr("href").inparen();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/RSV/golfTeeOff03_m.jsp";
  const method = "post";
  const param = {
    yyyymmdd: date,
  };
  const dictCourse = {
    1: "태백",
    2: "백두",
    3: "함백",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:goReserv", true);
    Array.from(els).forEach((el) => {
      let [time, , course] = el.attr("href").inparen();
      date = date.rm("-");
      course = dictCourse[course];
      const fee_normal = 160000;
      const fee_discount = 160000;
      const hole = 18;

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