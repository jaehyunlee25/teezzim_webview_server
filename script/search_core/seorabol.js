const num = date == thisdate ? 0 : 1;
  const param = {
    cal_month: num,
  };
  get("/Mobile/Reservation/reservation.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "javascript:transDate", true);
    Array.from(els).forEach((el) => {
      const [date] = el.attr("onClick").inparen();
      dates.push([date, ""]);
    });
    callback();
  });
/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/mobile/sub03_1.asp";
  const method = "post";
  const param = {
    submitDate: date,
  };
  const dictCourse = {
    A: "Hill",
    B: "Lake",
    C: "Mountain",
    D: "Valley",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "bookProsecc", true);
    Array.from(els).forEach((el) => {
      let [date, time, course] = el.attr("onClick").inparen();
      course = dictCourse[course];
      const fee_normal = 150000;
      const fee_discount = 150000;
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