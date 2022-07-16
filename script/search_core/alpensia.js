function mneCall(date, callback) {
  const as = Array.from(document.getElementsByClassName("cal_lots"));
  as.forEach((a) => {
    const num = a.innerText.addzero();
    const fulldate = date + num;
    dates.push([fulldate, 0]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    companyCd: "J51",
    clickTdId: "A20220731",
    clickTdClass: "hol",
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    selfTYn: "",
    temp001: "",
    bookgComment: "",
    memberCd: "90",
    temp007: "",
    agencyReservationYn: "N",
    certSeq: "",
    certNoChk: "",
    agencyBookgName: "",
    agencyHp1: "",
    agencyHp2: "",
    agencyHp3: "",
    agreeYn: "Y",
    contactTel1: "",
    contactTel2: "",
    contactTel3: "",
    comment: "",
  };
  post("/reservation/ajax/golfTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const table = ifr.getElementsByClassName("tbl demo1")[0];
    const tbody = table.getElementsByTagName("tbody")[0];
    const trs = tbody.children;

    Array.from(trs).forEach((tr) => {
      const course = tr.children[1].innerText;
      const time = tr.children[2].innerText;
      const fee_normal = tr.children[4].innerText.split(",").join("") * 1;
      const fee_discount = tr.children[5].innerText.split(",").join("") * 1;

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
  workMonthNext();
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 3000);
});
