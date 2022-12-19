function mneCall(date, callback) {
log("luna-x", date);
  const dt = date + "01";
  const param = {
    year: date.gh(4),
    month: date.gt(2),
  };
  get("//api.luna-x.cc/calendars", param, {}, (data) => {
    const json = data.jp();
    const els = json.data;
    Array.from(els).forEach((el) => {
      if (el.tCount == 0) return;
      const { tcda_date: date, tcda_gubun: sign, weeknum: gb } = el;
      dates.push([date, sign, gb]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "//api.luna-x.cc/calendars/detail";
  const method = "get";
  const param = {
    year: date.gh(4),
    month: date.ch(4).gh(2),
    date: date.gt(2),
  };
  const dictCourse = {
    11: "V",
    22: "A",
    33: "B",
    44: "C",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.data;
    Array.from(els).forEach((el) => {
      let { course, hole, hour, minute, price } = el;
      course = dictCourse[course];
      const fee_normal = price;
      const fee_discount = price;
      const time = (hour + "").addzero() + (minute + "").addzero();

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
