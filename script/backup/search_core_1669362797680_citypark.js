function mneCall(date, callback) {
  const dt = (date + "01").datify("/");
  const param = {
    intYY: date.gh(4),
    intMM: date.gt(2),
    hid_AllCnt: "9",
    hid_ResCnt: "",
  };
  post(
    "//golf.citypark.co.kr:8090/golfreservation_new/calendar_new.asp",
    param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gba("onclick", "FnCalendarClick", true);
      Array.from(els).forEach((el) => {
        const [dt, sign, gb] = el.attr("onclick").inparen();
        dates.push([date + dt, sign, gb]);
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
    "//golf.citypark.co.kr:8090/golfreservation_new/mobile/revDo2.asp";
  const method = "get";
  const param = {
    year: date.gh(4),
    month: date.ch(4).gh(2),
    day: date.gt(2),
    pCon_Code: gb,
  };
  const dictCourse = {
    1: "시티",
    2: "파크",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "rev", true);
    Array.from(els).forEach((el) => {
      let [course, hole, time] = el.attr("onclick").inparen();
      time = time.rm(":");
      course = dictCourse[course];
      hole = hole.regex(/[0-9]+/)[0];
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