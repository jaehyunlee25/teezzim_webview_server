function mneCall(date, callback) {
  const els = document.getElementsByClassName("cal_live");
  Array.from(els).forEach((el) => {
    const param = el.getAttribute("href").inparen();
    dates.push([param[0], param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "10",
    pointdate: date,
    openyn: "2",
    dategbn: option[2],
    choice_time: "00",
    self_openyn: "N",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {};
  post("/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("cm_time_list_tbl")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = el.children[1].innerText;
      const time = el.children[2].innerText;
      const fee_normal = el.children[4].innerText.split(",").join("") * 1;
      const fee_discount = el.children[4].innerText.split(",").join("") * 1;

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