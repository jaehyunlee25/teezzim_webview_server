function mneCall(date, callback) {
  const els = document
    .getElementsByClassName("cm_liv")
    .getElementsByTagName("a");
  Array.from(els).forEach((el) => {
    const param = el.getAttribute("href").inparen();
    const fulldate = param[0];
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {};
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "10",
    pointdate: date,
    openyn: "1",
    dategbn: option[2],
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  post(
    "/_mobile/GolfRes/onepage/real_timelist_ajax_list.asp",
    param,
    {},
    (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;
      const els = ifr
        .getElementsByClassName("cm_time_live_tab_list")[0]
        .getElementsByTagName("a");
      Array.from(els).forEach((el) => {
        const param = el.getAttribute("href").inparen();
        const course = param[3];
        const time = param[2];
        let fee_normal = param[8].getFee();
        let fee_discount = param[8].getFee();

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
    }
  );
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);