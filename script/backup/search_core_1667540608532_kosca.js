function mneCall(date, callback) {
  const els = ifr.gcn("cal_live");
  Array.from(els).forEach((el) => {
    const [date, sign] = el.attr("href").inparen();
    dates.push([date, sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "60",
    pointdate: date,
    openyn: num,
    dategbn: "",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    1: "행복",
    2: "사랑",
    3: "나눔",
  };

  post("/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("onclick", "javascript:timeapply_subcmd", true);
    Array.from(els).forEach((el) => {
      let [, course, time] = el.attr("onclick").inparen();
      course = dictCourse[course];
      fee_normal = el.nm(2, 4).str().rm(",") * 1;
      fee_discount = el.nm(2, 5).str().rm(",") * 1;
      const hole = el.nm(2, 3).str();

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
