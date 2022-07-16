function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$contents$sManager"] =
    "ctl00$contents$sManager|ctl00$contents$btUp";
  param["__EVENTTARGET"] = "ctl00$contents$btUp";
  param["ctl00$contents$htbArgs"] = "CALENDAR|" + (date + "01").datify() + "|";
  post("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("reserved");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const fulldate = param[0].split("|")[2].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {};
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$contents$sManager"] =
    "ctl00$contents$sManager|ctl00$contents$btUp";
  param["__EVENTTARGET"] = "ctl00$contents$btUp";
  param["ctl00$contents$htbArgs"] = option[0];
  post("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByClassName("reserve")[0]
      .getElementsByTagName("tr");
    Array.from(els).forEach((el) => {
      const course = "단일";
      const time = el.children[2].innerText;
      let fee_normal = 130000;
      let fee_discount = 130000;

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
