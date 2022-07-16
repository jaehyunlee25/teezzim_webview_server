function mneCall(date, callback) {
  const param = {
    book_yymm: date,
  };
  post("/mobile/reservation_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("book");
    Array.from(els).forEach((el) => {
      const param = el
        .getElementsByTagName("a")[0]
        .getAttribute("href")
        .inparen();
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
