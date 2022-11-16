function mneCall(date, callback) {
  const els = doc.body.gba("href", "javascript:timefrom_change", true);
  Array.from(els).forEach((el) => {
    const [date, sign, gb, , , opt] = el.attr("href").inparen();
    if (opt != "T") return;
    dates.push([date, sign, gb]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/GolfRes/onepage/real_timelist_ajax_list.asp";
  const method = "post";
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "70",
    pointdate: date,
    openyn: sign,
    dategbn: gb,
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    1: "Ocean",
    2: "Rocky",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "javascript:timeapply_subcmd", true);
    Array.from(els).forEach((el) => {
      let [, course, time] = el.attr("onclick").inparen();
      course = dictCourse[course];
      hole = el.nm(2, 4).str().ct(1);
      const fee = el.nm(2, 5).str().rm(",") * 1;
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
