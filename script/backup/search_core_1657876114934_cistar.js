function mneCall(date, callback) {
  const param = {
    V_IN_START_DATE: date + "01",
  };
  post("/proc/selectGolfCalendar.do", param, {}, (data) => {
    const els = JSON.parse(data).rows.OUT_DATA;
    Array.from(els).forEach((el) => {
      Object.keys(el).forEach((day) => {
        const val = el[day];
        if (!val) return;
        if (val.ch(4).gh(1) == "N") return;
        const fulldate = date + val.gh(2);
        dates.push([fulldate, param]);
      });
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {};
  const param = {
    V_IN_START_DATE: date,
    V_IN_DATE: date,
    V_IN_GOLF_ID: "P1",
    V_IN_PROPERTY: "41",
    f_flag: "new",
  };
  post("/proc/selectGolfTime.do", param, {}, (data) => {
    const els = JSON.parse(data).rows.OUT_DATA;
    els.forEach((el, i) => {
      let hour;
      Object.keys(el).forEach((key) => {
        const val = el[key];
        if (!val) return;
        if (key == "TIME_HH") {
          hour = val;
          return;
        }
        const tm = val.gh(2);
        const course = "단일";
        const time = [hour, tm].join("");
        let fee_normal = 120000;
        let fee_discount = 120000;

        if (isNaN(fee_normal)) fee_normal = -1;
        if (isNaN(fee_discount)) fee_discount = -1;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: "18홀",
        });
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
