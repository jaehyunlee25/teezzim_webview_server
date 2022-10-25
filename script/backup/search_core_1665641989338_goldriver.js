function mneCall(date, callback) {
  const param = {
    now: (date + "01").datify(),
  };
  get("/new/sub4/menu1.php", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("month_list")[0].gtn("dd");
    Array.from(els).forEach((el) => {
      if (el.children.length == 0) return;
      const date = el.children[0].attr("href").gt(10).rm("-");
      dates.push([date, ""]);
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
