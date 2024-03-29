function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    method: "getCalendarHome",
    coDiv: "818",
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
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
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/controller/ReservationController.asp";
  const method = "post";
  const param = {
    method: "getTeeList",
    coDiv: "818",
    date: date,
    cos: "All",
  };
  const dictCourse = {
    A: "Gaon",
    B: "Nury",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      let {
        BK_DAY: date,
        BK_TIME: time,
        BK_S_CHARGE_NM: fee,
        BK_COS: course,
        BK_ROUNDF_NM: hole,
      } = el;
      course = dictCourse[course];
      hole = hole.ct(1);
      fee = fee.rm(",") * 1;
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
mneCall(thisdate, procDate);
