function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    date: dt,
  };
  get("//respiawas.xyz/logic/book/golf/list/monthly", param, {}, (data) => {
    const json = data.jp();

    const els = json;
    Array.from(els).forEach((el) => {
      const date = el;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "//respiawas.xyz/logic/book/golf/list/daily?date=" + date;
  const method = "post";
  const param = {
    responseType: "json",
    headers: {
      headers: {},
      lazyUpdate: null,
      normalizeName: {},
    },
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, { "Content-Type": "application/json" }, (data) => {
    const json = data.jp();
    const els = json;
    Array.from(els).forEach((el) => {
      let { date, hour, minute, course } = el;
      const time = hour.addzero() + minute.addzero();
      course = dictCourse[course];
      hole = 20;
      const fee = 100000;
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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});