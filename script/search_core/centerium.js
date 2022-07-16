function mneCall(date, callback) {
  const param = {
    nYear: date.gh(4),
    nMonth: date.gt(2),
  };
  get("/mobile/reservation/reservation1.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("possible");
    Array.from(els).forEach((el) => {
      const a = el.getElementsByTagName("a")[0];
      const param = a.getAttribute("href").inparen();
      const fulldate = param[1].trim();
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    club_code: "",
    booking_date: date,
    day_gubun: option[2].trim(),
    gbn: "1",
    evt_cd: "",
  };
  const dictCourse = {
    A: "England",
    B: "Scotland",
    C: "Wales",
  };
  post("/mobile/reservation/reservation2.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("reserCourseList")[0]
      .getElementsByClassName("listBox");
    Array.from(els).forEach((el, i) => {
      if (i == 0) return;
      const param = el.getAttribute("href").inparen();
      const course = dictCourse[param[2]];
      const time = param[1];
      let fee_normal = param[5].split(",").join("") * 1;
      let fee_discount = param[4].split(",").join("") * 1;

      if (isNaN(fee_normal)) fee_normal = -1;
      if (isNaN(fee_discount)) fee_discount = -1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "18홀",
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
