function mneCall(date, callback) {
  const param = {
    coDiv: "802",
    bkMedia: "R",
    stDate: date + "01",
    edDate: date + "31",
  };
  post("/golf/getReservableDate.do", param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      if (el.ABLE_COS == "X") return;
      dates.push([el.CL_SOLAR, el.CL_BUSINESS]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
log(arrDate);
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/golf/getReservableTimes.do";
  const method = "post";
  const param = {
    coDiv: "802",
    bkDay: date,
    bkCos: "A",
    bkMedia: "R",
    agency: "",
    startCnt: "0",
    countInPage: "10",
  };
  const dictCourse = {
    A: "Sky",
    B: "Palm",
    C: "Lake",
    D: "Valley",
  };
  const arr = ["A", "B", "C", "D"];
  exec();
  function exec() {
    const signCourse = arr.shift();
    if (!signCourse) {
      procDate();
      return;
    }
    param.bkCos = signCourse;
    fCall[method](addr, param, {}, (data) => {
      const json = data.jp();
      const els = json.rows;
      Array.from(els).forEach((el) => {
        const time = el.BK_TIME;
        const course = dictCourse[el.BK_COS];
        const hole = 18;
        const fee = el.BK_CHARGE_NM * 1;
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
      exec();
    });
  }
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});