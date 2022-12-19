function mneCall(date, callback) {
  const param = {
    coDiv: "71",
    mType: "M",
    calDate: date + "01",
    submitDate: "",
    bkTime: "",
    bkCourse: "",
    greenFee: "",
  };
  post("/reservation/status", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("open");
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
  const dictCourse = {
    A: "Cherryhill",
    B: "Pine",
    C: "Valley",
    D: "Lake",
  };
  const param = {
    submitDate: date,
    coDiv: "71",
    mType: "M",
  };
  post("/reservation/select", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByClassName("reservation_table time_table")[0]
      .getElementsByTagName("button");
    Array.from(els).forEach((el, i) => {
      const param = el.getAttribute("onclick").inparen();
      const course = dictCourse[param[3]];
      const time = param[2];
      let fee_normal = param[5].getFee();
      let fee_discount = param[5].getFee();

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
