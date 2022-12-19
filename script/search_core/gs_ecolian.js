function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const prm = {
    f_flag: "bsns",
    f_bsns: "32",
  };
  post("/asp/rsvn/rsvn_proc.asp", prm, {}, (data) => {
    const param = {
      f_flag: "calendar",
      f_yy: date.gh(4),
      f_mm: date.gt(2),
      f_bsns: "32",
    };
    post("/asp/rsvn/rsvn_proc.asp", param, {}, (data) => {
      const json = data.jp();
      const els = json.rtnData;
      Array.from(els).forEach((el) => {
        if (el.IT_OPEN_TLT != "예약") return;
        dates.push([el.CD_DT.rm("-"), el.IT_OPEN]);
      });
      callback();
    });
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/asp/rsvn/rsvn_proc.asp";
  const method = "post";
  const param = {
    f_flag: "time",
    f_date: date.datify(),
    f_rsvntype: "1",
    f_bsns: "32",
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.rtnData;
    Array.from(els).forEach((el) => {
      let { CH_COURSE: course, ROUND_DESC: hole, R_TIME: time } = el;
      time = time.rm(":");
      hole = hole.ct(1);
      course = dictCourse[course];
      const fee = "0";
      fee_normal = fee.rm(",") * 1;
      fee_discount = fee.rm(",") * 1;

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


