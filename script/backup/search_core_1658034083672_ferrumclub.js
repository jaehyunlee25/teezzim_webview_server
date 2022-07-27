function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "20",
    toDay: "",
    calnum: "1",
  };
  post("/m/reservation/real_calendar_ajax_view.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName(" reser ");
    Array.from(els).forEach((el) => {
      const param = el.children[0].getAttribute("href").inparen();
      const fulldate = param[0].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    1: "동",
    2: "서",
  };
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "20",
    pointdate: date,
    openyn: "1",
    dategbn: option[2],
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  post("/m/reservation/real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByClassName("default_3")[0]
      .getElementsByTagName("tr");
    Array.from(els).forEach((el, i) => {
      const param = el
        .getElementsByTagName("a")[0]
        .getAttribute("href")
        .inparen();
      const course = dictCourse[param[1]];
      const time = param[2];
      let fee_normal = param[8].getFee();
      let fee_discount = param[9].getFee();

      if (isNaN(fee_normal)) fee_normal = -1;
      if (isNaN(fee_discount)) fee_discount = -1;

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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
