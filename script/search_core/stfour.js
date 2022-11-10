function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "70",
    toDay: date + "01",
    calnum: "1",
  };
  post(
    "/_mobile/GolfRes/onepage/real_calendar_ajax_view.asp",
    param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gba("href", "javascript:timefrom_change", true);
      Array.from(els).forEach((el) => {
        const [date, sign, , , , opt] = el.attr("href").inparen();
        if (opt != "T") return;
        dates.push([date, sign]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/_mobile/GolfRes/onepage/real_timelist_ajax_list.asp";
  const method = "post";
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "70",
    pointdate: date,
    openyn: sign,
    dategbn: "",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    1: "CIELO",
    2: "BOSCO",
    3: "MARE",
    4: "VITA",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "javascript:timeapply_subcmd", true);
    Array.from(els).forEach((el) => {
      let [, course, time] = el.attr("onclick").inparen();
      course = dictCourse[course];
      const hole = el.nm(0, 3).str().ct(1);
      const fee_normal = el.nm(0, 4).str().rm(",") * 1;
      const fee_discount = el.nm(0, 5).str().rm(",") * 1;

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