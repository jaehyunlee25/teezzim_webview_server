function mneCall(date, callback) {
  const opt = date == thisdate ? 0 : 1;
  const param = { cal_month: opt };
  get("reservation_date.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tds = Array.from(ifr.getElementsByClassName("possible"));
    tds.forEach((td) => {
      const str = td.innerText.addzero();
      const strDate = date + str;
      dates.push([strDate, 0]);
    });
    callback();
  });
}

function mneCallDetail(arrDate) {
  procDate();
  /* const [date] = arrDate;
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
    }); */
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
