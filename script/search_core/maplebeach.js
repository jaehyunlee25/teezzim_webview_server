function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    cal_month: date == thisdate ? 0 : 1,
  };
  get(
    "//user.maplebeach.co.kr/new/reservation/inc/calendar_golf.asp",
    param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gba("onclick", "javascript:transDate", true);
      Array.from(els).forEach((el) => {
        const [date] = el.attr("onclick").inparen();
        dates.push([date, ""]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/new/reservation/golf/reservation_step1.asp";
  const method = "post";
  const param = {
    submitDate: date,
    rDate: date,
  };
  const dictCourse = {
    A: "Maple",
    B: "Beach",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "JavaScript:onclick=bookProsecc", true);
    Array.from(els).forEach((el) => {
      let [date, time, course] = el.attr("href").inparen(true);
      course = dictCourse[course];
      hole = 18;
      const fee = 0 * 1;
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
