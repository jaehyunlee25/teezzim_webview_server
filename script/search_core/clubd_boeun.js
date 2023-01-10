function mneCall(date, callback) {
  const dt = (date + "01").datify("/");
  const param = {
    coDiv: "01",
    selYM: date,
    _: new Date().getTime(),
  };
  get("/clubd/reservation/getCalendar.do", param, {}, (data) => {
    const { rows: els } = data.jp();
    Array.from(els).forEach((el) => {
      if (el.BK_TEAM == "0") return;
      const { CL_SOLAR: date, CL_BUSINESS: sign, CL_DAYDIV: gb } = el;
      dates.push([date, sign, gb]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    A: "East",
    B: "West",
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
log(course);
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