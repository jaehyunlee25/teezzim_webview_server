function mneCall(date, callback) {
  const param = {
    V_IN_PLAY_MONTH: date,
    V_IN_MEMB_TYPE: "CY",
  };
  post("/proc/selectCalendarInq.do", param, {}, (data) => {
    const { rows } = data.jp();
    const res = [];
    let prev;
    rows.forEach((ob) => {
      if (ob.CLASS == "1") {
        prev = ob;
        return;
      }
      Object.keys(ob).forEach((key) => {
        if (key.gh(1) != "A") return;
        const dt = ob[key];
        const sign = prev[key];
        if (sign == "3" || sign == "8") res.push(date + dt);
      });
    });

    Array.from(res).forEach((dt) => {
      dates.push([dt, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/proc/selectTeeupInq.do";
  const method = "post";
  const param = {
    V_IN_PLAY_DATE: date,
    V_IN_MEMB_TYPE: "CY",
    V_IN_COSE_TYPE_CODE: 1,
  };
  const dictCourse = {
    1: "마우나",
    2: "블루",
    3: "오션",
  };
  const courses = [1, 2, 3];
  exec();

  function exec() {
    let courseNum = courses.shift();
    if (!courseNum) {
      procDate();
      return;
    }
    param.V_IN_COSE_TYPE_CODE = courseNum;
    fCall[method](addr, param, {}, (data) => {
      const { rows: els } = data.jp();
      els.forEach((el) => {
        let { CH_HOUR, CH_MINUTE, CH_HOLE_DESC: hole } = el;
        const time = CH_HOUR + CH_MINUTE;
        hole = hole.ch(1).ct(2);
        course = dictCourse[courseNum];
        const fee_normal = 185000;
        const fee_discount = 185000;

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