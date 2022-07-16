function mneCall(date, callback) {
  const param = {
    nYear: date.gh(4),
    nMonth: date.gt(2),
  };
  get("/mobile/reservation/reservation1.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("possible");
    Array.from(els).forEach((el) => {
      const a = el.getElementsByTagName("a")[0];
      const param = a.getAttribute("href").inparen();
      const fulldate = param[1].trim();
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
