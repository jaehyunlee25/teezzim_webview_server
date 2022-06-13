function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: 10,
    toDay: date + "01",
    calnum: 2,
  };
  post("real_calendar_ajax_view.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName("a");
    Array.from(as).forEach((a) => {
      const ob = procHref(a.href);
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
    golfrestype: "real",
    courseid: 0,
    usrmemcd: 10,
    pointdate: date,
    openyn: 1,
    dategbn: 6,
    choice_time: "00",
    cssncourseum: "",
    inputtype: 1,
  };
  post("real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName("a");
    const obTeams = {};
    Array.from(as).forEach((a) => {
      const ob = procHrefDetail(a.href);
      if (!ob) return;
      const { course, time, fee_normal, fee_discount } = ob;
      const slot = time.gh(2);
      if (!obTeams[course]) obTeams[course] = {};
      if (!obTeams[course][slot]) obTeams[course][slot] = [];

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

function procHrefDetail(str) {
  const head = str.indexOf("subcmd");
  if (head === -1) return false;
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return {
    time: addColon(values[2]),
    course: values[3],
    fee_normal: values[8] * 1,
    fee_discount: values[9] * 1,
  };
}

function addColon(str) {
  return str.gh(2) + ":" + str.gt(2);
}

function procHref(str) {
  const head = str.indexOf("timefrom_change");
  if (head === -1) return false;
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[0], type: values[5] };
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
