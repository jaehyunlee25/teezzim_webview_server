function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
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
      const els = ifr.getElementsByClassName("cal_live");
      Array.from(els).forEach((el) => {
        const param = el.getAttribute("href").inparen();
        const fulldate = param[0].split("-").join("");
        dates.push([fulldate, param]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    마운틴: "Mountain",
    밸리: "Valley",
    레이크: "Lake",
  };
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
        .getElementsByClassName("cm_time_list_tbl")[0]
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");
      Array.from(els).forEach((el, i) => {
        const course = dictCourse[el.children[1].innerText];
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
