function mneCall(date, callback) {
  const els = document.getElementsByClassName("cm_liv");
  Array.from(els).forEach((el) => {
    const a = el.getElementsByTagName("a")[0];
    const param = a.getAttribute("href").inparen();
    const fulldate = param[0];
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);