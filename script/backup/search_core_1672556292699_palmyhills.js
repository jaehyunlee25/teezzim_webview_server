function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "480",
    selYm: date,
    division: "21",
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const { rows: els } = data.jp();
    els.forEach((el) => {
      if (el.BK_TEAM == "0") return;
      dates.push([el.CL_SOLAR, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/controller/ReservationController.asp";
  const method = "post";
  const param = {
    method: "getTeeList",
    coDiv: "",
    date: date,
    time: "All",
    cos: "All",
    division: "21",
  };
  const dictCourse = {
    A: "남Out",
    B: "남In",
    C: "동Out",
    D: "동In",
  };

  fCall[method](addr, param, {}, (data) => {
    const { rows: els } = data.jp();
    Array.from(els).forEach((el) => {
      let {
        BK_COS: course,
        BK_DAY: date,
        BK_ROUNDF_NM: hole,
        BK_TIME: time,
      } = el;
      hole = hole.ct(1);
      course = dictCourse[course];
      const fee_normal = 150000;
      const fee_discount = 150000;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole + "홀",
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
