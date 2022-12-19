function mneCall(date, callback) {
  const dt = date + "01";
  const param = {};
  get(
    "/api/reservation/pyeongchang/golf/phoenix/calendar/" + date,
    param,
    {},
    (data) => {
      const json = data.jp();
      const els = json;
      Array.from(els).forEach((el) => {
        if (el.rsrvStatNm != "예약가능") return;
        dates.push([el.rsrvDate, el.bsuCd]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/api/reservation/pyeongchang/golf/phoenix/time/" + date;
  const method = "get";
  const param = {};
  const dictCourse = {
    Lake: "Lake",
    Mountain: "Mountain",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json;
    Array.from(els).forEach((el) => {
      let { rsrvDate: date, rsrvTime: time, crsCd: course } = el;
      course = dictCourse[course];
      const hole = 18;
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
mneCall(thisdate, procDate);