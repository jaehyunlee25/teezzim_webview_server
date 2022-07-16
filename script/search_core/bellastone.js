function mneCall(date, callback) {
  const els = document.getElementsByClassName("reserv");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const fulldate = param[0].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {};
  param["thisDate"] = (date.ct(2) + "01").datify();
  param["strReserveDate"] = date.datify();
  param["strDayGubun"] = option[2];
  const dictCourse = {};
  post("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("timeTbl")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      const course = el.children[0].innerText;
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
mneCall(thisdate, procDate);