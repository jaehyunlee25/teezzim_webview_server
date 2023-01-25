function mneCall(date, callback) {
  let count = 0;
  const mneT = setInterval(() => {
    if (!window["golf_calendar"]) {
      count++;
      if (count > 10) {
        clearInterval(mneT);
        callback();
      }
      return;
    }
    clearInterval(mneT);
    const atds = doc.gtn("td");
    const tds = [];
    Array.from(atds).forEach((td) => {
      const tee = td.getAttribute("data-cnt");
      if (!tee || tee == 0) return;
      tds.push(td);
    });

    tds.forEach((td) => {
      const strDate = td.getAttribute("data-day");
      dates.push([strDate, 0]);
    });

    callback();
  }, 500);
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    lgubun: "160",
    date: date,
    changeDate: "",
    changeSeq: "",
  };
  post("/Reservation/AjaxTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if (i === 0) return;

      const course = tr.getAttribute("data-coursekor");
      const time = tr.children[1].innerHTML;
      const fee_normal = tr.children[2].innerHTML.ct(1).replace(/\,/g, "") * 1;
      const fee_discount =
        tr.children[2].innerHTML.ct(1).replace(/\,/g, "") * 1;
      const slot = time.gh(2);

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

mneCall(thisdate, procDate);
