function mneCall(date, callback) {
  const els = document.getElementsByClassName("cm_liv");
  Array.from(els).forEach((el) => {
    const param = el
      .getElementsByTagName("a")[0]
      .getAttribute("href")
      .inparen();
    dates.push([param[0], param]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);