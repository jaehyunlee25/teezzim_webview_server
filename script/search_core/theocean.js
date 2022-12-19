function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    PID: "0903",
    Year: date.gh(4),
    Month: date.gt(2),
    GUBUN: "",
    _: "1669280080501",
  };
  post("/main/golfReserveMonth.do", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("date", "", true);
    Array.from(els).forEach((el) => {
      const date = el.attr("date");
      dates.push([date.rm("-"), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/main/golfReserveStep2.do?PID=0903";
  const method = "post";
  const param = {};
  Array.from(reserveForm.elements).forEach((el) => (param[el.name] = el.value));
  param["selectDate"] = date.datify();
  const dictCourse = {
    웨스트오션: "West",
    이스트오션: "East",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:void", true);
    Array.from(els).forEach((el) => {
      let time = el.attr("tm");
      time = time.rm(":");
      course = dictCourse[el.nm(3, 0).str()];
      hole = 18;
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