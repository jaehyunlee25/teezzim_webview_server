function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: 10,
    toDay: date + "01",
    calnum: 1,
  };
  post("/GolfRes/mainpage/main_calendar_ajax_view.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("tooltip");
    Array.from(els).forEach((el) => {
      const [date, , , , , sign] = el.attr("href").inparen();
      if (sign != "T") return;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "10",
    pointdate: date,
    openyn: "2",
    dategbn: "7",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    1: "단일",
  };

  post("/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("cm_btn");
    Array.from(els).forEach((el) => {
      let [, , time] = el.attr("href").inparen();
      course = dictCourse[1];
      const fee = el.parentNode.parentNode.children[4].str().rm(",");
      fee_normal = fee * 1;
      fee_discount = fee * 1;

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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
