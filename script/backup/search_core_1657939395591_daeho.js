function mneCall(date, callback) {
  const els = document
    .getElementsByClassName("cm_liv")
    .getElementsByTagName("a");
  Array.from(els).forEach((el) => {
    const param = el.getAttribute("href").inparen();
    const fulldate = param[0];
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);