function mneCall(date, callback) {
  const els = document.getElementsByClassName("MReser");
  Array.from(els).forEach((el) => {
    const param = el.getAttribute("href").inparen();
    if (param[0] === "0") return;
    dates.push([param[0], param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    A: "West",
    B: "East",
  };
  const param = {
    coDiv: "01",
    date: date,
    _: new Date().getTime(),
  };
  post("/clubd/reservation/getTeeList.do", param, {}, (data) => {
    const els = JSON.parse(data).rows;
    els.forEach((el, i) => {
      const course = dictCourse[el.BK_COS];
      const time = el.BK_TIME;
      let fee_normal = el.BK_BASIC_CHARGE * 1;
      let fee_discount = el.BK_CHARGE.split(",")[1] * 1;

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