function mneCall(date, callback) {
  const param = {
    book_date_bd: date + "01",
    book_date_be: "",
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };
  post("/html/reserve/reserve01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "JavaScript:Date_Click", true);
    Array.from(els).forEach((el) => {
      const [year, month, date] = el.attr(attr).inparen();
      const fulldate = [year, month, date].join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    SelDate: date.datify(),
  };
  const dictCourse = {};
  get("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("timeTbl")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      const course = el.children[0].innerText;
      const time = el.children[1].innerText;
      let fee_normal = el.children[2].innerText.ct(1).split(",").join("") * 1;
      let fee_discount = el.children[2].innerText.ct(1).split(",").join("") * 1;

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
