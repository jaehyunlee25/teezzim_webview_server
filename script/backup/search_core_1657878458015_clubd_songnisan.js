function mneCall(date, callback) {
  const els = document.getElementsByClassName("MReser");
  Array.from(els).forEach((el) => {
    const param = el.getAttribute("href").inparen();
    if (param[0] === "0") return;
    dates.push([param[0], param]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);