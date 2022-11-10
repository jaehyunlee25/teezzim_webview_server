function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "show_index_timeTable", true);
  Array.from(els).forEach((el) => {
    const [date, sign] = el.attr("onclick").inparen();
    dates.push([date.rm("-"), sign]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);