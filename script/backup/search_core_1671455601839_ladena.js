function mneCall(strdate, callback) {
  const param = {};
  const els = doc.gba("href", "javascript:timefrom_change", true);
  Array.from(els).forEach((el) => {
    const [date,,,,,opt] = el.attr("href").inparen();
    if(opt != "T") return;
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "31",
    pointdate: date,
    openyn: "1",
    dategbn: "3",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    1: "Lake",
    2: "Garden",
    3: "Nature",
  };

  post("/_mobile/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
    log(data);
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:subcmd", true);
    Array.from(els).forEach((el, i) => {
      let [, course, time] = el.attr("href").inparen();
      course = dictCourse[course];
      const fee_discount = 220000;
      const fee_normal = 220000;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "18홀",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);