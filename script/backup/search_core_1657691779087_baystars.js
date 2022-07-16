function mneCall(date, callback) {
  const param = {
    book_yymm: date
  };
  get("/mobile/reservation_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByTagName("td");
    Array.from(els).forEach((el) => {
      if(el.children.length < 1) return;
      const param = el.children[0].getAttribute("href").inparen();
      dates.push([param[1], param]);
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
