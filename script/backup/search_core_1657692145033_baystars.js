function mneCall(date, callback) {
  const param = {
    book_yymm: date,
  };
  get("/mobile/reservation_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByTagName("td");
    Array.from(els).forEach((el) => {
      if (el.children.length < 1) return;
      if (el.children[0].tagName == "SPAN") return;
      const param = el.children[0].getAttribute("href").inparen();
      dates.push([param[1], param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    coGubun: "M",
    date: date,
    type: "reserv",
    chg_date: "",
    chg_seq: "",
    chg_time: "",
    chg_course: "",
  };
  const dictCourse = {
    STARS: "Stars",
    BAY: "Bay",
  };
  post("/Mobile/Booking/SelectTime", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("typeB")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      const course = dictCourse[el.children[0].innerText];
      const time = el.children[1].innerText;
      let fee_normal = el.children[3].innerText.ct(1).split(",").join("") * 1;
      let fee_discount = el.children[3].innerText.ct(1).split(",").join("") * 1;

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
