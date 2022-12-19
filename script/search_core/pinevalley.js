function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    hid_BlocNo: "02",
    month: date.ch(4).gh(2),
    year: date.gh(4),
    memsel: "",
  };
  get("/mobile/reservation/m_reserve_pv.jsp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:goReal", true);
    Array.from(els).forEach((el) => {
      const [date, ,] = el.attr("href").inparen();
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reservation/m_rtime.jsp?hid_BlocNo=02&memsel=700";
  const method = "post";
  const param = {};
  Array.from(frmMain.elements).forEach((el) => (param[el.name] = el.value));
  param["selDate"] = date;
  const dictCourse = {
    1: "Valley",
    2: "Pine",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("href", "javascript:gogonext", true);
    Array.from(els).forEach((el) => {
      let [time, , fee, course] = el.attr("href").inparen(true);
      course = dictCourse[course.replace(/\s/g, "")];
      const hole = 18;
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