function mneCall(date, callback) {
  const els = document.getElementsByClassName("book");
  Array.from(els).forEach((el) => {
    const param = el.parentNode.getAttribute("onclick").inparen();
    const fulldate = [param[0], param[1], param[2]].join("");
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);