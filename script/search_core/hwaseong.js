function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    cal_month: date == thisdate ? 0 : 1,
  };
  get("/mobile/reser.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "javascript:transDate", true);
    Array.from(els).forEach((el) => {
      const [date] = el.attr("onclick").inparen();
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reser_time.asp";
  const method = "post";
  const param = {
    submitDate: date,
  };
  const dictCourse = {
    A: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "JavaScript:onclick=bookProsecc1", true);
    Array.from(els).forEach((el) => {
      let [date, time, course] = el.attr("href").inparen();
      hole = el.nm(2, 2).str().replace(/\s/g, "").ct(1);
      course = dictCourse[course];
      const fee = el.nm(2, 3).str().ch(1);
      fee_normal = fee.rm(",") * 1;
      fee_discount = fee.rm(",") * 1;

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