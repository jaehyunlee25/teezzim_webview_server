function mneCall(date, callback) {
  const aas = document.getElementsByTagName("a");
  const as = [];
  Array.from(aas).forEach((a) => {
    const tee = a.getAttribute("href");
    if (!tee || tee.indexOf("JavaScript:Date_Click") === -1) return;
    as.push(tee);
  });
  as.forEach((tee) => {
    const strDate = tee.split("'")[1];
    dates.push([strDate, 0]);
  });
  callback();
}

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    book_date: date,
    book_yymm: date.ct(2),
  };
  post("/html/reservation/reservation_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr
      .getElementsByClassName("reserve_info")[0]
      .getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if (i < 2) return;

      const course = tr.children[1].innerHTML.replace(/\s/g, "");
      const time = tr.children[2].innerHTML;
      const fee_normal = tr.children[4].innerText.replace(/\,/g, "") * 1;
      const fee_discount = tr.children[4].innerText.replace(/\,/g, "") * 1;

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

mneCall(thisdate, () => {
  get("reservation_01.asp", { book_yymm: "202206" }, {}, (data) => {
    document.body.innerHTML = data;
    mneCall(nextdate, procDate);
  });
});
