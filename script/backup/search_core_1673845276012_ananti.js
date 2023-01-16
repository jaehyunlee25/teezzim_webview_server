function mneCall(date, callback) {
  const els = document.getElementsByClassName("date-default");
  Array.from(els).forEach((el) => {
    const fulldate = el.getAttribute("data-day");
    if (!fulldate) return;
    dates.push([fulldate, 0]);
  });
  callback();
}
function funcSearch() {
  log(
    "funcSearch",
    "/ko/reservation/namhae/golf?memNo=" + custm.cmMateCno + "&date="
  );
  location.href =
    "/ko/reservation/namhae/golf?memNo=" + custm.cmMateCno + "&date=";
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const courseDict = {
    1: "Out",
    2: "In",
  };
  const param = {
    bsns: "12",
    memNo: memberNo,
    guestNo: custm.cmNo,
    frDate: [date.gh(4), date.ch(4).gh(2), date.gt(2)].join("-"),
  };
  $.ajax({
    url: "/reservation/namhae/ajax/search-only-golf",
    method: "post",
    type: "json",
    contentType: "application/json",
    data: JSON.stringify(searchGolf),
    success: function (result) {
      if (result.code === 200) {
        result.data.forEach((datum) => {
          const courseCode = datum.course;
          const course = courseDict[courseCode];
          const time = datum.time;
          const fee_discount = datum.rate * 1;
          const fee_normal = datum.rate * 1;
          golf_schedule.push({
            golf_club_id: clubId,
            golf_course_id: course,
            date,
            time,
            in_out: "",
            persons: "",
            fee_normal,
            fee_discount,
            others: "18홀",
          });
        });
        procDate();
      }
    },
  });
}

/* <============line_div==========> */
/* <============line_div==========> */
mneCall(thisdate, procDate);
