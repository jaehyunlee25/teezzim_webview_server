function mneCall(date, callback) {
  const param = {
    target_date: (date + "01").datify(),
  };
  post("/api/v1/realtimeReserveListMonth", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.data;
    Array.from(els).forEach((el) => {
      if (el.able_cnt == 0) return;
      const date = el.reserve_date;
      dates.push([date.rm("-"), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    target_date: date.datify(),
  };
  const dictCourse = {
    HILL: "HILL",
    LAKE: "LAKE",
    PINE: "PINE",
  };

  post("/api/v1/realTimeReserveTimeTableList", param, {}, (data) => {
    const json = data.jp();
    const els = json.data_all.time;
    Object.keys(els).forEach((fulltime) => {
      els[fulltime].forEach((obj) => {
        if (obj.is_reserve != "가능") return;
        const time = fulltime.ct(3).rm(":");
        const fee = obj.greenfee;
        const course = dictCourse[obj.course_id];
        const fee_normal = fee;
        const fee_discount = fee;
        const hole = "9홀";
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
mneCall(thisdate, procDate);