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
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {
    strReserveDate: date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2),
    strGolfLgubun: 160,
  };

  get("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr.getElementsByClassName("cosTable")[0];
    const els = tbl.getElementsByTagName("tr");

    const obTeams = {};
    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = el.children[0].innerText;
      const time = el.children[1].children[0].innerText;
      const fee_discount = el.children[3].innerText.split(",").join("") * 1;
      const fee_normal = el.children[2].innerText.split(",").join("") * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "9홀",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  document.getElementsByClassName("right")[1].click();
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 1000);
});
