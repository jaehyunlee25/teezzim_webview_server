function mneCall(date, callback) {
  const els = document.getElementsByClassName("book");
  Array.from(els).forEach((el) => {
    if (el.tagName != "A") return;
    const param = el.getAttribute("onclick").inparen();
    const fulldate = param.join("");
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);