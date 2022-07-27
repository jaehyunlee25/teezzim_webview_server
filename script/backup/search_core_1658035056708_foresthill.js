function mneCall(date, callback) {
  const els = document.getElementsByClassName("book");
  Array.from(els).forEach((el) => {
    const param = el.children[0].getAttribute("href").inparen();
    const fulldate = param.join("");
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {};
  const param = {
    book_date: date,
    ThisDate: undefined,
  };
  post("/reservation_02_re.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByClassName("typeD text-center mt2")[0]
      .getElementsByTagName("button");
    Array.from(els).forEach((el, i) => {
      const param = el.getAttribute("onclick").inparen();
      const course = param[3];
      const time = param[4];
      let fee_normal = 210000;
      let fee_discount = 210000;

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