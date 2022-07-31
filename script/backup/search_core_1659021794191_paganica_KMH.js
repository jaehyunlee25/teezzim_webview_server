function mneCall(year, callback) {
  const param = {};
  const els = document.getElementsByClassName("can");
  Array.from(els).forEach((el) => {
    const href = el.getAttribute("href");
    const m = el.innerText.split("/")[0].addzero();
    const d = el.innerText.split("/")[1];
    const date = year + m + d;
    dates.push([date, ""]);
  });
  callback();
}

function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {
    strReserveDate: date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2),
    strGolfLgubun: 120,
  };

  get("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr.getElementsByClassName("cosTable")[0];
    const els = tbl.getElementsByTagName("tr");

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

mneCall(thisyear, procDate);
