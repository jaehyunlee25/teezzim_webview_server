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

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});