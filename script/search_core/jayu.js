function mneCall(date, callback) {
  const param = {};
  post(
    "/api/v1/realtimeReserveListMonth?target_date=" + date.datify(),
    param,
    {},
    (data) => {
      const { data: els } = data.jp();
      els.forEach((el) => {
        const { able_cnt, reserve_date: date } = el;
        if (able_cnt == 0) return;
        dates.push([date.rm("-"), ""]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr =
    "/api/v1/realTimeReserveTimeTableList?target_date=" + date.datify();
  const method = "post";
  const param = {};
  const dictCourse = {
    OUT: "Out",
    IN: "In",
  };

  fCall[method](addr, param, {}, (data) => {
    const { data_all } = data.jp();
    let { time: els } = data_all;
    Object.keys(els).forEach((el) => {
      const time = el.rm(":").ct(2);
      els[el].forEach((ob) => {
        let { course_id: course, greenfee: fee, is_reserve } = ob;
        if (is_reserve != "가능") return;
        hole = 18;
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
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
