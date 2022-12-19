function mneCall(date, callback) {
  const dt = date + "01";
  const param = {};
  get("/erp/s12.spa?sdate=", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "selectDate", true);
    Array.from(els).forEach((el) => {
      const [date, opt] = el.attr("onclick").inparen();
      if (opt != "0") return;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/erp/rsvTime.spa";
  const method = "post";
  const param = {
    sdate: date,
    it: "0",
  };
  const dictCourse = {
    A: "Out",
    B: "In",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "rsvSelect", true);
    Array.from(els).forEach((el) => {
      let [date, course, time, hole] = el.attr("onclick").inparen();
      course = dictCourse[course];
      hole = hole.ct(1);
      time = time.rm(":");
      const fee = 135000;
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
mneCall(thisdate, procDate);