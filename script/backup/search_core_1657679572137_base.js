function mneCall(date, callback) {
  const els = document.getElementsByClassName("reserv");
  Array.from(els).forEach((el) => {
    const param = el.getAttribute("href").inparen();
    const fulldate = param[1].split("-").join("");
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  document.getElementsByClassName("arrow arrow_R")[0].children[0].click();
  mneCall(nextdate, procDate);
});
