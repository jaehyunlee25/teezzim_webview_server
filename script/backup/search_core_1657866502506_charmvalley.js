function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "401",
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByTagName("possible");
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
