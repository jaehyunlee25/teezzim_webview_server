function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["thisDate"] = (date + "01").datify();
  post("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    console.log(data);
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("date");
    Array.from(els).forEach((el) => {
      const param = el.parentNode.getAttribute("onclick").inparen();
      const fulldate = param[1].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    11: "Front",
    22: "Back",
  };
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["Choice_Date"] = date.datify();
  param["Day_Gubun"] = option[2];
  post("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByTagName("cal21");
    Array.from(els).forEach((el, i) => {
      const param = el.getAttribute("href").inparen();
      const course = dictCourse[param[1]];
      const time = param[2];
      let fee_normal = 110000;
      let fee_discount = 110000;

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
