function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$contents$ScrptManager1"] =
    "ctl00$contents$ScrptManager1|ctl00$contents$btnUp";
  param["__EVENTTARGET"] = "ctl00$contents$btnUp";
  param["ctl00$contents$htbArgs"] = "PREV|2022-07-01|2022-07-01";
  post("/Mobile/", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("reserved");
    Array.from(els).forEach((el) => {
      const fulldate = el.innerText.addzero();
      dates.push([fulldate, ""]);
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
