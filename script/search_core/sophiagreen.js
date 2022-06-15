function mneCall(date, callback) {
  const opt = date == thisdate ? 0 : 1;
  const param = {
    bookgAgree: "Y",
    clickTdId: "",
    clickTdClass: "",
    workMonth: date,
    workDate: "20220615",
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "",
    searchTime: "",
    selfTYn: "",
    temp001: "",
    bookgComment: "",
    confirmGubun: "",
    dcAmt: "",
    macroChk: "",
    timeHoleCd: "",
    bookgHoleCd: "",
    hole_choice: "2",
  };
  post("/reservation/ajax/golfCalendar", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = Array.from(ifr.getElementsByClassName("cal_live"));
    as.forEach((a) => {
      const str = a.innerText.addzero();
      const strDate = date + str;
      dates.push([strDate, 0]);
    });
    callback();
  });
}

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    bookgAgree: "Y",
    clickTdId: "A" + date,
    clickTdClass: "",
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    selfTYn: "",
    temp001: "",
    bookgComment: "",
    confirmGubun: "",
    dcAmt: "",
    macroChk: "",
    timeHoleCd: "2",
    bookgHoleCd: "2",
    hole_choice: "2",
  };
  post("/reservation/ajax/golfTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const trs = ifr.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    Array.from(trs).forEach((tr, i) => {
      const course = tr.children[1].innerHTML;
      const time = tr.children[2].innerHTML.split(":").join("");
      const fee_normal = 240000;
      const fee_discount = 240000;

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
  });
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
