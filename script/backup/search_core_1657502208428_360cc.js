function mneCall(date, callback) {
  const param = {};
  const els = document.getElementsByClassName("cal_live");
  Array.from(els).forEach((el) => {
    const href = el.getAttribute("href");
    if (href === "#") return;
    const date = thisdate + el.innerText.addzero();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  document.getElementsByClassName("right")[1].click();
  setTimeout(() => {
    // mneCall(nextdate, procDate);
    mneCall(nextdate, ()=>{console.log(dates});
  }, 1000);
});
