function mneCall(date, callback) {
  const param = {
    bookingYm: date,
    viewGubun: "front",
  };
  post("/front/booking/bookingMngR.do", param, {}, (data) => {
    const json = data.jp();
    const els = json;
    els.forEach((el) => {
      const { bookingMgtNo: date } = el;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/front/booking/bookingMngDtlR.do";
  const method = "post";
  const param = {
    bookingMgtNo: date,
    startTimeH: "",
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json;
    Array.from(els).forEach((el) => {
      let { bookingMgtNo: date, teeOffTime: time, roundCdType: hole } = el;
      course = dictCourse[1];
      hole *= 1;
      const fee = 0;
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