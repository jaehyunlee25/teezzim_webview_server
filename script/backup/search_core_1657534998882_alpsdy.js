function mneCall(date, callback) {
  const param = {
    ThisDate: [date.gh(4), date.gt(2), "01"].join("-"),
  };
  get("/Mobile/reservation/reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const table = ifr.getElementsByClassName("tbl02")[0];
    const thead = table.getElementsByTagName("thead")[0];
    const as = thead.getElementsByClassName("r_choice");

    Array.from(as).forEach((a) => {
      const num = a.innerText.addzero();
      const fulldate = date + num;
      dates.push([fulldate, 0]);
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
