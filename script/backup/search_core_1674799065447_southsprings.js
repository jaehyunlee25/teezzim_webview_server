function mneCall(date, callback) {
  const opt = date == thisdate ? 0 : 1;
  const param = { cal_month: opt };
  get("reservation_date.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tds = Array.from(ifr.getElementsByClassName("possible"));
    tds.forEach((td) => {
      const str = td.innerText.addzero();
      const strDate = date + str;
      dates.push([strDate, 0]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reservation_time.asp";
  const method = "post";
  const param = {
    submitDate: date,
  };
  const dictCourse = {
    A: "Lake",
    B: "Mountain",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "JavaScript:onclick=bookProsecc", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, hole] = el.attr(attr).inparen();
      course = dictCourse[course];
      hole = hole.ct(1);
      const fee = el.nm(2, 2).str().split("\n");
      const fee_normal = el.nm(2, 2).innerHTML.split("<br>")[0].rm(",") * 1;
      const fee_discount = el.nm(2, 2, 1, 0).str().rm(",") * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole + "홀",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
