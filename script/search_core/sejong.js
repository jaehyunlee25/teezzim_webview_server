function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    golfResType: "real",
    schDate: date,
    usrMemCd: "40",
    toDay: dt,
    calNum: "2",
    inputType: "M",
  };
  post(
    "/mobile/reservation/calendar/ajax_realtime_calendar_view.do",
    param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gba("href", "javascript:timefrom_change", true);
      Array.from(els).forEach((el) => {
        const [date, sign, gb, , , opt] = el.attr("href").inparen();
        if (opt != "T") return;
        dates.push([date, sign, gb]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reservation/list/ajax_real_timeinfo_list.do";
  const method = "post";
  const param = {
    golfResType: "real",
    courseId: "0",
    usrMemCd: "80",
    pointDate: date,
    openYn: sign,
    dateGbn: gb,
    choiceTime: "00",
    cssncourseum: "",
    inputType: "I",
  };
  const dictCourse = {
    1: "세종",
    2: "행복",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "javascript:timeapply_subcmd", true);
    Array.from(els).forEach((el) => {
      let [, course, time, , , , , , , , , hole, fee] = el
        .attr("onclick")
        .inparen(true);
      course = dictCourse[course.rm(" ")];
      hole = hole.ct(1);
      fee = fee.rm(",") * 1;
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