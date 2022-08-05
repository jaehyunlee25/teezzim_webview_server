function mneCall(date, callback) {
  const as = Array.from(document.getElementsByClassName("cal_live"));
  as.forEach((a) => {
    const obj = procStr(a.getAttribute("onclick"));
    dates.push([obj.date, obj.param]);
  });

  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    clickTdId: "A" + date,
    clickTdClass: "",
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    macroChk: "",
    agreeYn: "Y",
  };

  post("ajax/golfTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr.getElementsByClassName("tbl")[0];
    const els = tbl.getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (i == 0) return;
      const course = el.children[1].innerText;
log(course);
      const time = el.children[2].innerText;
      const fee_discount = el.children[5].innerText.split(",").join("") * 1;
      const fee_normal = el.children[4].innerText.split(",").join("") * 1;
      const holes = el.children[3].innerText;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: holes,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */
function procStr(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[2], param: "" };
}

/* <============line_div==========> */
mneCall(thisdate, () => {
  workMonthNext();
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 3000);
});
