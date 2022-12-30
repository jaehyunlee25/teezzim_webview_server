function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "502",
    selYm: date,
    sDivision: "75",
  };
  const today = (new Date().getDate() + "").addzero();
  get("/controller/ReservationController.asp", param, {}, (data) => {
    const { rows } = data.jp();
    rows.forEach((ob) => {
      if (ob.CL_SOLAR < thisdate + today) return;
      if (!ob.BK_TEAM) return;
      dates.push([ob.CL_SOLAR, ob.CL_DAYDIV, ob.CL_BUSINESS]);
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
    coDiv: "502",
    date,
    cos: "All",
    msNum: "750010525200",
  };
  const dictCourse = {
    A: "Silk",
    B: "River",
  };

  fCall[method](addr, param, {}, (data) => {
    const { rows: els } = data.jp();
    Array.from(els).forEach((el) => {
      let {
        BK_B_CHARGE_NM: fee_normal,
        BK_COS: course,
        BK_DAY: date,
        BK_D_CHARGE_NM: fee_discount,
        BK_TIME: time,
      } = el;
      const hole = 18;
      course = dictCourse[course];
      fee_normal = fee_normal * 1000;
      fee_discount = fee_discount * 1000;

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
