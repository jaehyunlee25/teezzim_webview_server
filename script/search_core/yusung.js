function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "202",
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = data.jp();
    const { rows: els } = json;
    Array.from(els).forEach((el) => {
      if (el.BK_TEAM == "0") return;
      dates.push([el.CL_SOLAR, el.CL_BUSINESS, el.CL_DAYDIV]);
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
    coDiv: "202",
    date: date,
  };
  const dictCourse = {
    A: "Out",
    B: "In",
  };

  fCall[method](addr, param, {}, (data) => {
    const { rows: els } = data.jp();
    Array.from(els).forEach((el) => {
      let {
        BK_AMT: fee,
        BK_COS: course,
        BK_DAY: date,
        BK_ROUNDF_NM: hole,
        BK_TIME: time,
      } = el;
      course = dictCourse[course];
      fee_normal = fee;
      fee_discount = fee;

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
