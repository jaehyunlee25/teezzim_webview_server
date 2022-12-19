function mneCall(date, callback) {
  const param = {
    yy: date.gh(4),
    mm: date.gt(2),
  };
  post("/index.php/res/divcal", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gca("val", "", true);
    Array.from(els).forEach((el) => {
      let date = el.attr("val");
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/index.php/res/step2";
  const method = "post";
  const param = {
    gm_date: date,
    gm_type: "res",
    over_reservation: "ok",
  };
  const dictCourse = {
    1: "남",
    2: "동",
    3: "서",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("crs", "", true);
    Array.from(els).forEach((el) => {
      let course = el.attr("crs");
      let time = el.attr("val");
      course = dictCourse[course];
      const hole = 18;
      const fee = 200000;
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
