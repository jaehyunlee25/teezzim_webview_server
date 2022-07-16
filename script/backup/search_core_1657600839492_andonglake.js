function mneCall(date, callback) {
  const els = ReservationDate.getElementsByTagName("a");
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