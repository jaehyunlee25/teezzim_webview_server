function mneCall(date, callback) {
  const param = {
    wdate: (date + "01").datify(),
    wtcode: "",
  };
  post("/_html/reserve_cal.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByTagName("tbody")[1]
      .getElementsByTagName("img");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      const fulldate = param[0].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {};
  const param = {
    cnt: date.datify(),
  };
  post("/_html/reserve_time.part.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.getElementsByTagName("thead")[0].getElementsByTagName("tr");
    Array.from(els).forEach((el, i) => {
      if (i < 2) return;
      const param = el.children;
      const course = "단일";
      const time = param[0].innerText;
      let fee_normal = 75000;
      let fee_discount = 75000;

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
