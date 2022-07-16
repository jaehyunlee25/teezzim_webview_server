function mneCall(strdate, callback) {
  const param = {};
  const els = document.getElementsByClassName("cal_live");
  Array.from(els).forEach((el) => {
    const href = el.getAttribute("href");
    if (href === "#") return;
    const date = strdate + el.innerText.addzero();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {
    golfResType: "real",
    courseId: "0",
    usrMemCd: "40",
    pointDate: date,
    openYn: "1",
    dateGbn: "3",
    choiceTime: "00",
    cssncourseum: "",
    inputType: "I",
  };
  const courseDict = {
    IN: "In",
    OUT: "Out",
  };

  post("/mobile/reservation/list/ajax_real_timeinfo_list.do", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr
      .getElementsByClassName("cm_time_list_tbl")[0]
      .getElementsByTagName("tbody")[0];
    const els = tbl.getElementsByTagName("tr");

    const obTeams = {};
    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = courseDict[el.children[1].innerText];
      const time = el.children[2].innerText;
      const fee_discount = el.children[4].innerText.split(",").join("") * 1;
      const fee_normal = el.children[4].innerText.split(",").join("") * 1;

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
  document.getElementsByClassName("right")[1].click();
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 1000);
});
