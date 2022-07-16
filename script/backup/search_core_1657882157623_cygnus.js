function mneCall(date, callback) {
  const els = document.getElementsByClassName("bookingdate");
  Array.from(els).forEach((el) => {
    const param = el
      .getElementsByTagName("a")[0]
      .getAttribute("href")
      .inparen();
    const fulldate = param[0].split("-").join("");
    dates.push([param[1], param]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);