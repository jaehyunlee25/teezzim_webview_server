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

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
