function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    coDiv: "20",
    mType: "M",
    calDate: date,
    submitDate: "",
    bkTime: "",
    bkCourse: "",
    greenFee: "",
  };
  post("/reservation/status", param, {}, (data) => {
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
  const addr = "/reservation/select";
  const method = "post";
  const param = {
    submitDate: date,
    coDiv: "20",
    mType: "M",
  };
  const dictCourse = {
    A: "South",
    B: "North",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "showConfirm", true);
    Array.from(els).forEach((el) => {
      let [date, , time, course, , , , ,] = el.attr("onclick").inparen(true);
      course = dictCourse[course];
      hole = 18;
      fee_normal = 120000;
      fee_discount = 120000;

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
