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
    companyCd: J51
clickTdId: A20220731
clickTdClass: hol
workMonth: 202207
workDate: 20220731
bookgDate: 
bookgTime: 
bookgCourse: ALL
searchTime: 
selfTYn: 
temp001: 
bookgComment: 
memberCd: 90
temp007: 
agencyReservationYn: N
certSeq: 
certNoChk: 
agencyBookgName: 
agencyHp1: 010
agencyHp2: 
agencyHp3: 
agreeYn: Y
contactTel1: 010
contactTel2: 9000
contactTel3: 6260
comment: 
  };
  post("/reservation/ajax/golfTimeList", param, {}, (data) => {
    const objResp = JSON.parse(data).rows;
    const dict = { A: "Mountain", B: "Lake", C: "Valley" };
    objResp.forEach((obj) => {
      const course = dict[obj.BK_COS];
      const time = obj.BK_TIME.gh(2) + ":" + obj.BK_TIME.gt(2);
      const fee_normal = obj.BK_BASIC_CHARGE.replace(/\,/g, "") * 1;
      const fee_discount = obj.BK_CHARGE.replace(/\,/g, "") * 1;

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
