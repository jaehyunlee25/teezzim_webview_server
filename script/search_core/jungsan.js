function mneCall(date, callback) {
  const param = {
    golfResType: "real",
    schDate: date,
    usrMemCd: "80",
    toDay: (date + "01").datify(),
    calNum: "1",
    inputType: "M",
  };
  post(
    "/mobile/reservation/calendar/ajax_realtime_calendar_view.do",
    param,
    {},
    (data) => {
      const attr = "href";
      const els = doc.gba(attr, "javascript:timefrom_change", true);
      Array.from(els).forEach((el) => {
        const [date, sign, gb, , , opt] = el.attr(attr).inparen();
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
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const method = "post";
  const param = {
    golfResType: "real",
    courseId: "0",
    usrMemCd: "80",
    pointDate: date,
    openYn: sign,
    dateGbn: week[gb - 1] + "요일",
    choiceTime: "00",
    cssncourseum: "",
    inputType: "I",
  };
  const dictCourse = {
    1: "해우(Sun)",
    2: "달우(Moon)",
    3: "별우(Star)",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "javascript:timeapply_subcmd", true);
    Array.from(els).forEach((el) => {
      let [, course, time, , , , , , , , , , hole, fee] = el
        .attr(attr)
        .inparen();
      hole = hole.ct(1);
      course = dictCourse[course];
      const fee_normal = fee * 1000;
      const fee_discount = fee * 1000;

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
