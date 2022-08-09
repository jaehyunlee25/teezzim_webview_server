function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "11",
    toDay: date + "01",
    calnum: "1",
  };
  post("real_calendar_ajax_view.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = Array.from(ifr.gcn("cal_live"));
    as.forEach((a) => {
      const param = a.attr("href").inparen();
      const [elDate] = param;
      dates.push([elDate, 0]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "11",
    pointdate: date,
    openyn: "1",
    dategbn: "3",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  post("real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const trs = ifr.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      const course = tr.children[1].innerHTML;
      const time = tr.children[2].innerHTML;
      const fee_normal = tr.children[4].innerHTML.replace(/\,/g, "") * 1;
      const fee_discount = tr.children[4].innerHTML.replace(/\,/g, "") * 1;

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
