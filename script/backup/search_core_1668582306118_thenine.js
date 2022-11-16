function mneCall(date, callback) {
  const els = doc.body.gba("href", "JavaScript:Date_Click", true);
  Array.from(els).forEach((el) => {
    const [year, month, date] = el.attr("href").inparen();
    dates.push([[year, month, date].join(""), ""]);
  });
  callback();
}

/* <============line_div==========> */
v
/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
