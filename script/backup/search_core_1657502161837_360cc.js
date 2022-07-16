
/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  Update("CALENDAR|" + nextyear + "-" + nextmonth + "|");
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 1000);
});
