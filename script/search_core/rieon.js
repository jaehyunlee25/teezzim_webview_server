function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "90",
    toDay: dt,
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
    usrmemcd: "90",
    pointdate: date,
    openyn: sign,
    dategbn: "",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    1: "길정",
    2: "리온",
    3: "마운틴",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "javascript:timeapply_subcmd", true);
    Array.from(els).forEach((el) => {
      let [, course, time] = el.attr("onclick").inparen();
      course = dictCourse[course];
      const [, , , tdHole, tdFee] = Array.from(el.children);
      const hole = tdHole.str().ct(1);
      const fee_normal = tdFee.str().rm(",") * 1;
      const fee_discount = tdFee.str().rm(",") * 1;

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
