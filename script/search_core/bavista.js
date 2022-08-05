function mneCall(date, opt, callback) {
  const param = {
    coGubun: "M",
    day: [date.gh(4), date.gt(2), "01"].join("/"),
    type: opt,
  };
  post("/Mobile/Ajax/MobileCalendar", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("sel");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      dates.push([param[0], param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    coGubun: "M",
    date: date,
    type: "reserv",
    chg_date: "",
    chg_seq: "",
    chg_time: "",
    chg_course: "",
  };
  post("/Mobile/Booking/SelectTime", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = el.children[0].innerText;
log(course);
      const time = el.children[1].innerText.ch(2);
      let fee_normal =
        el.children[3].innerText
          .trim()
          .split("\n")[0]
          .trim()
          .split(",")
          .join("") * 1;
      let fee_discount =
        el.children[3].innerText
          .trim()
          .split("\n")[1]
          .trim()
          .split(",")
          .join("") * 1;

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
mneCall(nextdate, "prev", () => {
  mneCall(thisdate, "next", procDate);
});
