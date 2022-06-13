function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "91",
    toDay: date + "01",
    calnum: 1,
    inputtype: "Q",
  };
  post("/GolfRes/mainpage/quick_calendar_ajax_view.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName("a");
    Array.from(as).forEach((a) => {
      const ob = procStr(a.href);
      if (!ob) return;
      if (ob.type !== "T") return;
      dates.push([ob.date, 0]);
    });
    callback();
  });
}

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    golfrestype: "T",
    courseid: 0,
    usrmemcd: 91,
    pointdate: date,
    openyn: 1,
    dategbn: 4,
    choice_time: "00",
    cssncourseum: "",
    inputtype: "Q",
  };
  post("/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if (i === 0) return;
      const course = tr.children[1].innerText;
      const time = tr.children[2].innerText;
      const fee_normal =
        tr.children[4].children[0].innerText.replace(/,/g, "") * 1;
      const fee_discount =
        tr.children[5].children[0].innerText.replace(/,/g, "") * 1;
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
        others: "",
      });
    });
    procDate();
  });
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
