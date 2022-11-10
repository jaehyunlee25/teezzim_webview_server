function mneCall(date, callback) {
  const param = {
    ThisDate: (date + "01").datify(),
    strJoin: "",
  };
  get("/Mobile/res/Reservation.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gtn("td");
    Array.from(els).forEach((el) => {
      const str = el.attr("onclick");
      if (!str) return;
      const [, date, opt] = str.inparen();
      if (opt != "Y") return;
      dates.push([date.rm("-"), ""]);
    });
    callback();
  });
}
/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    Choice_Date: date.datify(),
    strJoin: "",
  };
  const dictCourse = { 11: "단일" };

  post("/Mobile/res/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = doc.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("tbl02")[0].gtn("a");
    Array.from(els).forEach((el) => {
      let [date, time, course, , , hole] = el.attr("href").inparen();
      date = date.rm("-");
      course = dictCourse[course];
      hole = hole * 1 + "홀";
      const fee_discount = 60000;
      const fee_normal = 120000;

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
