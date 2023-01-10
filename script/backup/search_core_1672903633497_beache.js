function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["__EVENTTARGET"] = "btnUp";
  param["ScrptManager1"] = "ScrptManager1|btnUp";
  param["htbArgs"] =
    "CALENDAR|" + [date.gh(4), date.gt(2), "01"].join("-") + "|";
  post("/Mobile/", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("reserv");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const fulldate = param[0].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    SelDate: date.datify(),
  };
  const dictCourse = {};
  get("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("timeTbl")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      const course = el.children[0].innerText;
      const time = el.children[1].innerText;
      let fee_normal = el.children[2].innerText.ct(1).split(",").join("") * 1;
      let fee_discount = el.children[2].innerText.ct(1).split(",").join("") * 1;

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
