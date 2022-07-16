function mneCall(date, callback) {
  const els = document.getElementsByClassName("book");
  Array.from(els).forEach((el) => {
    if (el.tagName != "A") return;
    const param = el.getAttribute("onclick").inparen();
    const fulldate = param.join("");
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    book_date: date,
  };
  const dictCourse = {
    1: "Mountain",
    2: "Lake",
  };
  post("/mobile/reserve01_step1.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.getElementsByClassName("book");
    Array.from(els).forEach((el, i) => {
      const param = el.getAttribute("onclick").inparen();
      const course = dictCourse[param[1]];
      const time = param[2];
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
mneCall(thisdate, procDate);