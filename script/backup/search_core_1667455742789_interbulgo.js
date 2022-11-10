function mneCall(date, callback) {
  const param = {
    V_IN_CALLED_ATTR: "HP",
    V_IN_PLAY_START_DATE: date + "01",
    V_IN_PLAY_END_DATE: date + "31",
    V_IN_MEMB_NO: "",
  };
  post("/proc/selectAvlGolfCalendar.do", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.rows.OUT_DATA;
    Array.from(els).forEach((el) => {
      Object.keys(el).forEach((key) => {
        const val = el[key];
        if (val[5] == "1") return;
        dates.push([date + val.gh(2), ""]);
      });
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    V_IN_CALLED_ATTR: "HP",
    V_IN_PLAY_DATE: date,
    V_IN_RSVN_STATUS_CODE: "R",
    V_IN_COSE_TYPE_CODE: "1",
  };
  const dictCourse = {
    1: "단일",
  };

  post("/proc/selectRsvnTimeList.do", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.rows.OUT_DATA;
    Array.from(els).forEach((el) => {
      const hour = el.TIME_HH;
      Object.keys(el).forEach((key) => {
        if (key == "TIME_HH") return;
        let val = el[key];
        if (!val) return;
        val = val.split(" ").join("");
        const time = hour + val.gh(2);
        let hole = val.gt(3);
        if (hole.gh(1) == "N") hole = hole.ch(1);

        const course = dictCourse[1];
        const fee_normal = 60000;
        const fee_discount = 60000;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: hole,
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
