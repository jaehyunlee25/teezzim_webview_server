function mneCall(date, callback) {
  const param = {
    ThisDate: (date + "01").datify(),
  };
  get("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("onclick");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      const fulldate = param[1].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["Choice_Date"] = date.datify();
  const dictCourse = {
    11: "Black",
    22: "Valley",
  };
  post("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("tbl02")[0]
      .getElementsByTagName("a");

    Array.from(els).forEach((el, i) => {
      const param = el.getAttribute("href").inparen();
      const course = param[2];
      const time = param[1];
      let fee_normal = 130000;
      let fee_discount = 130000;

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