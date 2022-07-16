
/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  doNextMonth();
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 3000);
});
