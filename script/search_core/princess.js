function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    method: "getCalendar",
    coDiv: "710",
    selYm: date,
  };
  post("/controller/ReservationController_MYSQL.asp", param, {}, (data) => {
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
  const addr = "/controller/ReservationController_MYSQL.asp";
  const method = "post";
  const param = {
    method: "getTeeList",
    coDiv: "710",
    date,
  };
  const dictCourse = {
    A: "Pine",
    B: "Valley",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      let {
        BK_DAY: date,
        BK_TIME: time,
        BK_COS: course,
        BK_ROUNDF_NM: hole,
        BK_N_CHARGE_NM: fee_normal,
        BK_B_CHARGE_NM: fee_discount,
      } = el;
      course = dictCourse[course];
      hole = hole.ct(1);
      fee_normal = fee_normal.rm(",") * 1;
      fee_discount = fee_discount.rm(",") * 1;

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
