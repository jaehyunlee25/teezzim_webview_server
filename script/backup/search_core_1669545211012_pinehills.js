function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "40",
    toDay: date + "01",
    calnum: "1",
  };
  post(
    "/pinehills/GolfRes/onepage/real-lot_calendar_ajax_view.asp",
    param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gba("href", "javascript:timefrom_change", true);
      Array.from(els).forEach((el) => {
        const [date, sign, gb, , , opt] = el.attr("href").inparen();
        if (opt != "T") return;
        dates.push([date, sign, gb]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});