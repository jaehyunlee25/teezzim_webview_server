function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "611",
    selYm: date,
    msNum: "",
    msDivision: "21",
    msClass: "10",
    msLevel: "00",
  };
  post(
    "/controller/ReservationController.asp?R=" + new Date().getTime(),
    param,
    {},
    (data) => {
      const { rows: els } = data.jp();
      els.forEach((el) => {
        if (el.BK_TEAM == 0) return;
        if (el.CL_SOLAR == date + (new Date().getDate() + "").addzero()) return;
        const { CL_SOLAR: dt } = el;
        dates.push([dt, ""]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/controller/ReservationController.asp";
  const method = "post";
  const param = {
    method: "getTeeList",
    coDiv: "611",
    date: date,
    cos: "All",
    part: "1",
    msNum: "",
    msDivision: "21",
    msClass: "10",
    msLevel: "00",
  };
  const dictCourse = {
    A: "CHAMPION_Out",
    B: "CHAMPION_In",
    C: "MASTER_Out",
    D: "MASTER_In",
  };

  fCall[method](addr, param, {}, (data) => {
    const { rows: els } = data.jp();
    Array.from(els).forEach((el) => {
      let {
        BK_B_CHARGE_NM: fee,
        BK_COS: course,
        BK_DAY: date,
        BK_ROUNDF_NM: hole,
        BK_TIME: time,
      } = el;

      hole = hole.ct(1);
      fee = fee.rm(",") * 1;
      course = dictCourse[course];
      const fee_normal = fee;
      const fee_discount = fee;

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
