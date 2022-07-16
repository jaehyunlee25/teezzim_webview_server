function mneCall(date, callback) {
  const els = document.getElementsByClassName("cm_liv");
  Array.from(els).forEach((el) => {
    const a = el.getElementsByTagName("a")[0];
    const param = a.getAttribute("href").inparen();
    const fulldate = param[0];
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    cmrtype: "N",
    backurl: "/_mobile/GolfRes/onepage/real_reservation.asp?",
    pointdate: date,
    openyn: "1",
    dategbn: option[1],
    settype: "P",
  };
  const dictCourse = {
    레이크: "Lake",
    밸리: "Valley",
  };
  post("/_mobile/GolfRes/onepage/real_reservation.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("cm_time_live_tab_list")[0]
      .getElementsByTagName("tr");
    Array.from(els).forEach((el, i) => {
      if (i == 0) return;
      const param = el.children;
      const course = dictCourse[param[1].innerText];
      const time = param[2].innerText;
      let fee_normal = param[5].innerText.split(",").join("") * 1;
      let fee_discount = param[4].innerText.split(",").join("") * 1;

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
mneCall(thisdate, procDate);