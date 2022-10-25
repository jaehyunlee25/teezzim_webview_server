function mneCall(date, callback) {
  const els = doc.gcn("calendar")[0].gtn("a");
  Array.from(els).forEach((el) => {
    if (el.str() == "예약불가") return;
    const param = el.attr("href").inparen();
    const [fulldate] = param;
    dates.push([fulldate.rm("-"), 0]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);