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
  post("/reserve/cal_edit_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els0 = Array.from(
      ifr.getElementsByTagName("tbody")[8].getElementsByTagName("tr")
    );
    els0.splice(0, 3);
    const els1 = Array.from(
      ifr.getElementsByTagName("tbody")[11].getElementsByTagName("tr")
    );
    els1.splice(0, 3);
    const els = els0.concat(els1);
    Array.from(els).forEach((el, i) => {
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
