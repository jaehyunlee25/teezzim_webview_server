function mneCall(date, callback) {
  const els = doc.gcn("book");
  Array.from(els).forEach((el) => {
    if(!el.attr("onclick")) return;
    const [year, month, date] = el.attr("onclick").inparen();
    const dt = [year, month, date].join("");
    dates.push([dt, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    book_date: date,
  };
  const dictCourse = {
    1: "Imperial",
    2: "Majesty",
    3: "Palace",
  };

  post("/hampyeong/html/reserve/reserve01.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("course_select")[0].gtn("tr");
    Array.from(els).forEach((el) => {
      const [tdTime, tdFee, tdBtn] = el.children;
      let [date, course, time] = tdBtn.children[0].attr("onclick").inparen();
      const hole = "9홀";
      course = dictCourse[course];
      const fee_normal = tdFee.str().ct(1).rm(",") * 1;
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
mneCall(thisdate, procDate);