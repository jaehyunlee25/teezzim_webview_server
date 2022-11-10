function mneCall(date, callback) {
log("----------------------------------"+date);
  const els = doc.gcn("reserved");
  Array.from(els).forEach((el) => {
    const date = el.attr("data-day");
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    date: date,
    changeDate: "",
    changeSeq: "",
    course: "",
  };
  const dictCourse = {
    H: "H",
    M: "M",
  };

  post("/Reservation/AjaxTimeList", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = doc.gcn("timeTbl")[1].gtn("tr");
    Array.from(els).forEach((el) => {
      const [, tdDiv, tdTime, tdCourse] = el.children;
      const course = dictCourse[tdCourse.str()];
      const time = tdTime.str().rm(":");
      const hole = tdDiv.str().split("/")[1].trim().ct(1) + "홀";
      const fee_normal = 0;
      const fee_discount = 0;

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
  const dt = [thisdate.gh(4), thisdate.gt(2), "01"].join("/");
  change_calendar(dt,'next');
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 1000);
});
