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

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
