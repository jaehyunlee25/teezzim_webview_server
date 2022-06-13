function mneCall(date, callback) {
  const param = {
    companyCd: "J36",
    clickTdId: "",
    clickTdClass: "",
    workMonth: date,
    workDate: date + "05",
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "",
    searchTime: "",
    temp001: "",
    bookgComment: "",
    agencyReservationYn: "N",
    selfRYn: "N",
    agreeYn: "Y",
  };
  post("/reservation/ajax/golfCalendar", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbls = ifr.getElementsByClassName("cm_calender_tbl");
    let as = [];
    Array.from(tbls).forEach((tbl) => {
      const arr = Array.from(tbl.getElementsByTagName("a"));
      as = as.concat(arr);
    });

    as.forEach((a) => {
      if (a.className === "cal_end") return;
      const str = a.getAttribute("onclick");
      if (str.indexOf("CLOSE") !== -1) return;
      if (str.indexOf("NOOPEN") !== -1) return;
      const ob = procStr(str);
      dates.push([ob.date, 0]);
    });
    callback();
  });
}

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    companyCd: "J36",
    clickTdId: "",
    clickTdClass: "",
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    temp001: "",
    bookgComment: "",
    agencyReservationYn: "N",
    selfRYn: "N",
    agreeYn: "Y",
  };
  post("/reservation/ajax/golfTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if (i === 0) return;

      const course = tr.children[1].innerHTML;
      const time = tr.children[0].innerHTML;
      const fee_normal = tr.children[2].innerHTML.replace(/\,/g, "") * 1;
      const fee_discount = tr.children[4].innerHTML.replace(/\,/g, "") * 1;
      const slot = time.gh(2);

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

mneCall(thisdate, () => {
  workMonthNext();
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 3000);
});
