function mneCall(date, callback) {
  const param = {
    ThisDate: (date + "01").datify(),
  };
  get("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      const [opt, fulldate] = el.attr("onclick").inparen();
      if (opt == "none") return;
      dates.push([fulldate.rm("-"), 0]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {};
  const courseDict = {
    11: "Out",
    22: "In",
  };
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["Choice_Date"] = date.datify();

  post("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:Reserve", true);
    els.forEach((el, i) => {
      let [date, time, course, , , hole] = el.attr("href").inparen();
      course = courseDict[course];
      const fee_discount = 220000;
      const fee_normal = 220000;

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
