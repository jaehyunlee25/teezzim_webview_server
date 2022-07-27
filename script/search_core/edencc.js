function mneCall(date, callback) {
  const param = {
    wdate: (date + "01").datify(),
    wtcode: "",
  };
  post("/reserve/reserve.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByTagName("tbody")[7]
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
  if (golf_schedule.length > 4) {
    procDate();
    return;
  }
  post("/reserve/cal_edit_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByTagName("tr");
    Array.from(els).forEach((el, i) => {
      if (el.children.length != 5) return;
      if (el.children[0].children.length > 0) return;
      const course = "단일";
      const time = el.children[0].innerText;
      let fee_normal = 70000;
      let fee_discount = 70000;

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
