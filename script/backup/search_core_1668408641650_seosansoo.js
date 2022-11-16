function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$ContentPlaceHolder1$htbArgs"] = "NEXT|" + dt + "|";
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  post("/Mobile/", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("href", "javascript:location.href", true);
    Array.from(els).forEach((el) => {
      const str = el.attr("href");
      const date = str.split("?")[1].split("=")[1].rm("-").ct(2);
      dates.push([date, ""]);
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
