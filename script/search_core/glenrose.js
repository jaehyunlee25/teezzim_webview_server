function mneCall(date, callback) {
  const param = {
    calDay: date.gh(4) + "/" + date.gt(2) + "/" + new Date().getDate(),
    today: thisdate.gh(4) + "/" + thisdate.gt(2) + "/" + new Date().getDate(),
    companyCd: "L154",
  };
  get("/reve/mo/reserve/choice/calendar.do", param, {}, (data) => {
    const els = JSON.parse(data).data;
    Array.from(els).forEach((el) => {
      if (el.status != "SOON") return;
      const fulldate = date + ("" + el.day).addzero();
      dates.push([fulldate, 0]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const dictCourse = {
    1: "단일",
  };
  const param = {
    companyCd: "L154",
    bookgDt: date,
    bookgCourse: "",
  };
  get("/reve/mo/reserve/greenfee.do", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("listBox")[0].gtn("li");
    Array.from(els).forEach((el, i) => {
      const course = dictCourse[1];
      const time = el.attr("time");
      let fee_normal = el.attr("data-basic-amt").getFee();
      let fee_discount = el.attr("data-basic-amt").getFee();

      if (isNaN(fee_normal)) fee_normal = -1;
      if (isNaN(fee_discount)) fee_discount = -1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "9홀",
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
