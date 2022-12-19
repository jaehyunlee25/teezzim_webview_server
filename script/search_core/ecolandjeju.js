function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    f_date: dt,
  };
  post("/proc/selectRsvnCalendar.do", param, {}, (data) => {
    const json = data.jp();
    const els = json.rows.OUT_DATA;
    Array.from(els).forEach((el) => {
      if (el.AVAIL_CNT == "000") return;
      dates.push([el.CAL_DATE.rm("-"), el.DAY_TYPE]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/proc/selectRsvnTime.do";
  const method = "post";
  const param = {
    f_date: date.datify(),
    f_course: "1",
  };
  const dictCourse = {
    1: "와일드",
    2: "비치힐스",
    3: "에코",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.rows.OUT_DATA;
    Array.from(els).forEach((el) => {
      Object.keys(el).forEach((key) => {
        const val = el[key];
        if (key.gh(4) != "TIME") return;
        if (val && val.gt(1) == "R") {
          const course = dictCourse[el["COURSE"]];
          const hour = el["TIME_HH"];
          const time = hour + val.gh(2);
          const fee = 120000;
          const fee_normal = fee;
          const fee_discount = fee;
          const hole = 18;

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
        }
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
