function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$lnkBtnUpd";
  param["ctl00$contents$htbArgs"] =
    "CALENDAR|" + (date + "01").datify() + "|2022-07-15|NULL|NULL|NULL";
  param["__EVENTTARGET"] = "ctl00$contents$lnkBtnUpd";
  post("/Mobile/Booking/GolfCalendar.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("reserved");
    Array.from(els).forEach((el) => {
      if (el.tagName != "A") return;
      const param = el.getAttribute("href").inparen()[0].split("|");
      const fulldate = param[2].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$lnkBtnUpd";
  param["ctl00$contents$htbArgs"] =
    "LIST|" +
    (date.ct(2) + "01").datify() +
    "|" +
    date.datify() +
    "|NULL|NULL|NULL";
  param["__EVENTTARGET"] = "ctl00$contents$lnkBtnUpd";
  post("/Mobile/Booking/GolfCalendar.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("timeTbl")[1]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      const course = "단일";
      const time = el.children[2].innerText;
      let fee_normal = el.children[4].innerText.ct(1).split(",").join("") * 1;
      let fee_discount = el.children[5].innerText.ct(1).split(",").join("") * 1;

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