function mneCall(date, callback) {
  const param = {
    clickTdId: "",
    clickTdClass: "",
    workMonth: date,
    workDate: "",
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "",
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
  };
  post("/reservation/ajax/golfCalendar", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("cal_live");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      dates.push([param[2], param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    EAST: "East",
    WEST: "West",
    SOUTH: "South",
    NORTH: "North",
  };
  const param = {
    clickTdId: "A20220831",
    clickTdClass: "",
    workMonth: date.ch(2),
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
  };
  get("/reservation/ajax/golfTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByClassName("tbl demo1")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    Array.from(els).forEach((el) => {
      const course = dictCourse[el.children[1].innerText];
      const time = el.children[2].innerText;
      let fee_normal = el.children[4].innerText.split(",").join("") * 1;
      let fee_discount = el.children[4].innerText.split(",").join("") * 1;

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
        others: "18홀",
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
