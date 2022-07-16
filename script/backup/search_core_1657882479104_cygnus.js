function mneCall(date, callback) {
  const els = document.getElementsByClassName("bookingdate");
  Array.from(els).forEach((el) => {
    if (el.children.length === 0) return;
    const param = el
      .getElementsByTagName("a")[0]
      .getAttribute("onclick")
      .inparen();
    const fulldate = param[0].split("-").join("");
    dates.push([param[1], param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    SILK: "실크",
    RAMIE: "라미",
    COTTON: "코튼",
  };
  const param = {
    requestType: "get",
    chosenDate: date.datify(),
    course: "0",
    g_day: "0",
    date_type: option[2],
  };
  get("/booking/bookingModels.asp", param, {}, (data) => {
    const els = JSON.parse(data).data;
    els.forEach((el) => {
      const course = dictCourse[el.course];
      const time = el.time;
      let fee_normal = el.greenfee * 1;
      let fee_discount = el.onegreenfee * 1;

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