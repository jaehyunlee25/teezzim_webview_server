function mneCall(date, callback) {
  const tds = Array.from(calendarBox1.getElementsByClassName("possible"));
  tds.forEach((td) => {
    const num = td.innerText;
    const fulldate = date + num;
    dates.push([fulldate, 0]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  doNextMonth();
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 3000);
});
