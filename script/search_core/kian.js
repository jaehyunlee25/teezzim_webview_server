function mneCall(date, callback) {
  const param = {};
  get("/_html/reserve_cal.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = doc.body.gba("onclick", "return check_submit", true);
    Array.from(els).forEach((el) => {
      const [date] = el.attr("onclick").inparen();
      dates.push([date.rm("-"), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/_html/reserve_time.part.asp";
  const method = "post";
  const param = {
    cnt: date.datify(),
  };
  const dictCourse = {
    "0001": "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "return goReserve2", true);
    Array.from(els).forEach((el) => {
      let [, str, hole] = el.attr("onclick").inparen();
      let date = str.gh(8);
      let course = str.ch(8).gh(4);
      let time = str.ch(8).ch(4).gh(4);
      course = dictCourse[course];
      hole = hole.ct(1);
      const fee = 85000;
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
