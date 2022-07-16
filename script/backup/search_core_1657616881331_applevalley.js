function mneCall(date, callback) {
  const els = document.getElementsByClassName("cm_liv");
  Array.from(els).forEach((el) => {
    const fulldate = el.innerText.split("-").join("");
    dates.push([fulldate, 0]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);