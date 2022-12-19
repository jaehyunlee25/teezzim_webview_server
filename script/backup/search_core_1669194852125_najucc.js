function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    query: "list",
    smonth: dt,
  };
  get("/2019/mobile/reservation/reservation.php", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "dateReload", true);
    Array.from(els).forEach((el) => {
log("naju", el.str().replace(/\s/g, ""));
      let [dt] = el.str().regex(/[0-9]+/);
log("naju", dt);
      date = date + dt.addzero();
log("naju", date);
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/2019/mobile/reservation/daylist.php";
  const method = "get";
  const param = {
    year: date.gh(4),
    month: date.ch(4).gh(2),
    day: date.gt(2),
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "reservation2.php?", true);
    Array.from(els).forEach((el) => {
      let val = el.attr("href").split("&")[1].split("=")[1];
      const time = val.gt(4);
      course = dictCourse[1];
      hole = el.nm(2, 1).str().replace(/\s/g, "").ct(1);
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
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});