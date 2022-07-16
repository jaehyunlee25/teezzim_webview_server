function mneCall(strdate, callback) {
  const param = {};
  const els = document.getElementsByClassName("cal_live");
  Array.from(els).forEach((el) => {
    const date = procStr(el.getAttribute("href")).date;
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "13",
    pointdate: date,
    openyn: "1",
    dategbn: "4",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const courseDict = {
    마운틴: "Mountain",
    힐: "Hill",
    레이크: "Lake",
  };

  post("/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
console.log(data);
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.document
      .getElementsByClassName("cm_time_list_tbl")[0]
      .getElementsByTagName("tbody")[0].children;

    const obTeams = {};
    Array.from(els).forEach((el, i) => {
      const course = el.children[1].innerText;
      const time = el.children[2].innerText;
      const fee_discount = el.children[5].innerText.split(",").join("") * 1;
      const fee_normal = el.children[4].innerText.split(",").join("") * 1;

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
function procStr(str) {
  const regex = /javascript:timefrom_change\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[0] };
}
/* <============line_div==========> */
mneCall(thisdate, procDate);