function mneCall(date, callback) {
  const param = {
    ThisDate: (date + "01").datify(),
  };
  get("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("reserved");
    Array.from(els).forEach((el) => {
      const param = el.parentNode.getAttribute("href").inparen();
      const fulldate = param[1].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    11: "가든",
    22: "팰리스",
    33: "캐슬",
  };
  const param = {};
  const sign = ["11", "22", "33"];
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["Choice_Date"] = date.datify();
  param["Day_Gubun"] = option[2];
  param["strDayGubun"] = option[2];
  param["strReserveDate"] = date.datify();

  function exec() {
    const courseSign = sign.shift();
    if (!courseSign) {
      procDate();
      return;
    }
    param["strSeacchCourse"] = courseSign;
    post("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;
      const els = ifr.getElementsByClassName("bt_reserved");
      Array.from(els).forEach((el, i) => {
        if (i == 0) return;
        const param = el.children[0].getAttribute("href").inparen();
        const course = dictCourse[courseSign];
        const time = param[2];
        let fee_normal =
          el.parentNode.parentNode.children[2].innerText.getFee();
        let fee_discount =
          el.parentNode.parentNode.children[2].innerText.getFee();

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
    });
    exec();
  }
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
