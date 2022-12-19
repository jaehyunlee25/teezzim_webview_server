function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    golfrestype: "real",
    schDate: date,
    toDay: dt,
    calnum: "1",
  };
  post(
    "/_mobile/golfRes/onepage_main/real-lot_calendar_ajax_view.asp",
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
  const addr = "/_mobile/GolfRes/onepage/real_timelist_ajax_list.asp";
  const method = "post";
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "10",
    pointdate: date,
    openyn: sign,
    dategbn: gb,
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    1: "로드",
    2: "레이크",
    3: "힐스",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:subcmd", true);
    Array.from(els).forEach((el) => {
      let [, course, time, , , hole, , , fee_normal, fee_discount] = el
        .attr("href")
        .inparen(true);
      course = dictCourse[course];
      hole = hole.ct(1);
      fee_normal *= 1;
      fee_discount *= 1;

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
