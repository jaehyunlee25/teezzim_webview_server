const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "11",
    toDay: date + "01",
    calnum: "1",
  };
  post("real_calendar_ajax_view.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = Array.from(ifr.gcn("cal_live"));
    as.forEach((a) => {
      const param = a.attr("href").inparen();
      const [elDate] = param;
      dates.push([elDate, 0]);
    });
    callback();
  });
/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "10",
    pointdate: date,
    openyn: "1",
    dategbn: "3",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    1: "South",
    2: "East",
    3: "West",
  };
  post(
    "/_mobile/GolfRes/onepage/real_timelist_ajax_list.asp",
    param,
    {},
    (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;
      const els = ifr.gba("onclick", "javascript:timeapply_subcmd", true);
      Array.from(els).forEach((el, i) => {
        let [, course, time] = el.attr("onclick").inparen();
        course = dictCourse[course];
        const fee_normal = el.nm(2, 3).str().rm(",") * 1;
        const fee_discount = fee_normal;
        const hole = "9홀";

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
    }
  );
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});