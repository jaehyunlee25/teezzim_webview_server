function mneCall(date, callback) {
  const param = {
    ThisDate: (date + "01").datify(),
  };
  get("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("reserved");
    Array.from(els).forEach((el) => {
      if (el.tagName != "A") return;
      const param = el.getAttribute("href").inparen();
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
  param["strReserveDate"] = date.datify();
  param["strDayGubun"] = option[2];
  const dictCourse = {};
  post("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("timeTbl")[1]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      const course = "단일";
      const time = el.children[1].innerText;
      let fee_normal = el.children[3].innerText.split(",").join("") * 1;
      let fee_discount = el.children[3].innerText.split(",").join("") * 1;

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