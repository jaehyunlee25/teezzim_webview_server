function mneCall(date, callback) {
  const param = {
    search_ym: date,
    site_gbn: "KC",
  };
  post("/reservation/golf_calendar.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("reserv_posi");
    Array.from(els).forEach((el) => {
      const [, date] = el.attr("onclick").inparen();
      dates.push([date.rm("-"), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
