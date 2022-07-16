function mneCall(date, callback) {
  const els = document
    .getElementsByClassName("tbl02")[0]
    .getElementsByClassName("r_choice");
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
    document.getElementsByClassName("y_next")[0].click();
    setTimeout(() => {
        mneCall(nextdate, procDate);
    }, 3000)
    
});