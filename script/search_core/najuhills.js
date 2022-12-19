function mneCall(date, callback) {
  const rows = doc.gcn("fc-content-skeleton");
  const res = {};
  rows.forEach((row) => {
    const elDates = Array.from(row.gtn("thead")[0].gtn("tr")[0].children);
    const elTeams = Array.from(row.gtn("tbody")[0].gtn("tr")[0].children);
    elDates.forEach((el, i) => {
      const strDate = el.attr("data-date");
      let num = elTeams[i].str() * 1;
      if (!num) num = 0;
      if (num > 0) res[strDate.rm("-")] = num;
    });
  });

  Object.keys(res).forEach((date) => {
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const rows = doc.gcn("fc-content-skeleton");
  const res = {};
  rows.forEach((row) => {
    const elDates = Array.from(row.gtn("thead")[0].gtn("tr")[0].children);
    const elTeams = Array.from(row.gtn("tbody")[0].gtn("tr")[0].children);
    elDates.forEach((el, i) => {
      const strDate = el.attr("data-date");
      let num = elTeams[i].str() * 1;
      if (!num) num = 0;
      if (num > 0) res[strDate.rm("-")] = el;
    });
  });

  res[date].click();

  /* fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("rounding");
    Array.from(els).forEach((el) => {
      let time = el.nm(2, 0).str().rm(":");
      let hole = el.str().ct(1);
      course = dictCourse[1];
      const fee = 60000;
      fee_normal = fee;
      fee_discount = fee;

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
  }); */
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
