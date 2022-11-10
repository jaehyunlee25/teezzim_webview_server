function mneCall(date, callback) {
  const els = doc.gcn("possible");
  Array.from(els).forEach((el) => {
    const date = $(el).data("date");
    log("see::" + date);
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    method: "getTeeList",
    coDiv: globals.coDiv,
    date: date,
    cos: "All",
    part: "partAll",
    msNum: "210032260519",
    division: "21",
    class: "00",
    level: "00",
  };
  const dictCourse = {
    해: "HAE",
    솔: "SOL",
    리아: "LIA",
  };

  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.rows;
    Array.from(els).forEach((el) => {
      const {
        BK_CHARGE_NM,
        BK_COS_NM,
        BK_DAY: date,
        BK_ROUNDF_NM: hole,
        BK_TIME: time,
      } = el;
      const course = dictCourse[BK_COS_NM];
      const fee_discount = BK_CHARGE_NM * 1;
      const fee_normal = fee_discount;

      if (fee_normal == 0) return;

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
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  doNextMonth();
  setTimeout(() => {
    mneCall(nextdate, procDate);    
  }, 2000);
});
