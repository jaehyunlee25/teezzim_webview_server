function mneCall(date, callback) {
  const param = {
    ThisDate: date,
    repnum: "",
  };
  post("/mobile/reserve01.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("book");
    Array.from(els).forEach((el) => {
      const [year, month, dt] = el.attr("onclick").inparen();
      const date = [year, month, dt].join("");
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    book_date: date,
    repnum: "",
  };
  const dictCourse = {
    1: "Human",
    2: "Happy",
    3: "Heart",
    4: "Healing",
  };

  post("/mobile/reserve01_step1.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("src", "../../images/reserve/button.gif");
    Array.from(els).forEach((el) => {
      let [, , course, , time, fee] = el.attr("onclick").inparen();
      course = dictCourse[course];
      const hole = "9홀";
      const fee_normal = fee * 1;
      const fee_discount = fee * 1;

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
