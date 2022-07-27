function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    resetcode: "H62",
    schDate: date,
    usrmemcd: "10",
    toDay: "",
    calnum: "1",
  };
  post(
    "/_mobile/GolfRes/onepage/real_calendar_ajax_view.asp",
    param,
    {},
    (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;
      const els = ifr.getElementsByClassName("cm_liv");
      Array.from(els).forEach((el) => {
        const param = el
          .getElementsByTagName("a")[0]
          .getAttribute("href")
          .inparen();
        dates.push([param[0], param]);
      });
      callback();
    }
  );
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
    openyn: "2",
    dategbn: option[2],
    choice_time: "07",
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
        .getElementsByTagName("tr");
      Array.from(els).forEach((el, i) => {
        if (i === 0) return;
        const course = el.children[0].innerText;
        const time = el.children[2].innerText;
        let fee_normal = el.children[4].innerText.getFee();
        let fee_discount = el.children[5].innerText.getFee();

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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
