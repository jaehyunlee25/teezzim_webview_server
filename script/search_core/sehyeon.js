function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    method: "getCalendar",
    coDiv: "165",
    stDate: date + "01",
    edDate: date + "31",
    idx: "0",
    media: "R",
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      if (el.BK_TEAM == "0") return;
      dates.push([el.CL_SOLAR, el.CL_BUSINESS]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/controller/ReservationController.asp";
  const method = "post";
  const param = {
    method: "getTeeList",
    coDiv: "165",
    date,
    part: "",
    media: "R",
  };
  const dictCourse = {
    A: "Valley",
    B: "Lake",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      let {
        BK_DAY: date,
        BK_TIME: time,
        BK_COS: course,
        BK_CHARGE_NM: fee,
      } = el;
      course = dictCourse[course];
      const hole = 18;
      fee_normal = fee * 1;
      fee_discount = fee * 1;

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
