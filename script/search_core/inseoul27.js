function mneCall(date, callback) {
  const param = {
    ThisDate: date,
  };
  post("/m61.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("temperature");
    Array.from(els).forEach((el) => {
      if (el.str().indexOf("팀") == -1) return;
      const [year, month, date] = el.parentNode.attr("href").inparen();
      const dt = [year, month, date].join("");
      dates.push([dt, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    book_date: date,
  };
  const dictCourse = {
    1: "EAST",
    2: "WEST",
    3: "SOUTH",
  };

  post("/m61.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("btnDate");
    Array.from(els).forEach((el) => {
      let [date, course, time, fee] = el.attr("onclick").inparen();
      const hole = "18홀";
      course = dictCourse[course];
      const fee_normal = fee * 1;
      const fee_discount = fee_normal;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole,
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
