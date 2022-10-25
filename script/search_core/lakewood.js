function mneCall(date, callback) {
  timer(1000, () => { 
    const param = {
      clickTdId: "",
      clickTdClass: "",
      workMonth: date,
      workDate: date + "01",
      bookgDate: "",
      bookgTime: "",
      bookgCourse: "",
      searchTime: "",
      selfTYn: "",
      macroChk: "",
      temp001: "",
      bookgComment: "",
      memberCd: 61,
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
        const str = a.attr("onclick");
        if (str.indexOf("CLOSE") !== -1) return;
        if (str.indexOf("NOOPEN") !== -1) return;
        console.log(str);
        const [ , , date] = str.inparen();
        log(date);
        dates.push([date, 0]);
      });
  
      callback();
    });

  });
}

/* <============line_div==========> */
function mneCallDetail([date], weekend) {
log(date, typeof date);
  const param = {
    clickTdId: "",
    clickTdClass: "",
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    selfTYn: "",
    macroChk: "",
    temp001: "",
    bookgComment: "",
    memberCd: 61,
  };
  post("/reservation/ajax/golfTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if (i === 0) return;

      const course = tr.children[1].innerHTML;
      const time = tr.children[2].innerHTML;
      const fee_normal = weekend ? 270000 : 210000;
      const fee_discount = weekend ? 125000 : 110000;
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

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
