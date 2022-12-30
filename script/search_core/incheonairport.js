function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "90",
    toDay: date + "01",
    calnum: "1",
  };
  post("/GolfRes/mainpage/main_calendar_ajax_view.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "href";
    const els = ifr.gba(attr, "javascript:main_timefrom_change", true);
    els.forEach((el) => {
      const [date, sign, gb, , , opt] = el.attr(attr).inparen();
      if (opt != "T") return;
      dates.push([date, sign, gb]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, sign, gb] = arrDate;
  const dictCourse = {
    1: "Out",
    2: "In",
  };
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "90",
    pointdate: date,
    openyn: sign,
    dategbn: gb,
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  post("/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "javascript:timeapply_subcmd", true);
    els.forEach((el) => {
      let [, course, time] = el.attr(attr).inparen();
      course = dictCourse[course];
      const hole = el.nm(2, 3).str().ct(1);
      const fee_normal = el.nm(2, 4).str().rm(",") * 1;
      const fee_discount = el.nm(2, 5).str().rm(",") * 1;

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
