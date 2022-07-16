function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "NEXT|" + [date.gh(4), date.gt(2), "01"].join("-") + "|";
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

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
