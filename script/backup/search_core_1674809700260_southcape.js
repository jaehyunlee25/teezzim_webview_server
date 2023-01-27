function mneCall(date, callback) {
  const els = doc.gba("class", "calendar__day");
  Array.from(els).forEach((el) => {
    const fulldate = el.attr("id");
    dates.push([fulldate, ""]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */
function funcMove() {
  doc.gba("value", "GO")[0].click();
  doc.gba("class", "pubNextBtn")[0].click();
}

/* <============line_div==========> */
mneCall(thisdate, procDate);