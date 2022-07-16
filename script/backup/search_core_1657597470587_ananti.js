function mneCall(date, callback) {
  const els = document.getElementsByClassName("date-default");
  Array.from(els).forEach((el) => {
    const fulldate = el.getAttribute("data-day");
    if (!fulldate) return;
    dates.push([fulldate, 0]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
