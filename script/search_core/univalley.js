function mneCall(date, callback) {
  const els = doc.body.gba("href", "sub.php?m=96&mode=select", true);
  Array.from(els).forEach((el) => {
    const date = el.attr("href").split("&")[3].split("=")[1];
    dates.push([date.rm("-"), ""]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});