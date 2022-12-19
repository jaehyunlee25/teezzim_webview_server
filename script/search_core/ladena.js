function mneCall(strdate, callback) {
  const param = {};
  const els = doc.gcn("cal_live");
  Array.from(els).forEach((el) => {
    const date = procStr(el.attr("href")).date;
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
    usrmemcd: "31",
    pointdate: date,
    openyn: "1",
    dategbn: "4",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    마운틴: "Lake",
    힐: "Garden",
    레이크: "Nature",
  };

  post("/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr
      .gcn("cm_time_list_tbl")[0]
      .gtn("tbody")[0].children;

    const obTeams = {};
    Array.from(els).forEach((el, i) => {
      const course = dictCourse[el.children[1].str().gt(1)];
      const time = el.children[2].str().rm(":");
      const fee_discount = 220000;
      const fee_normal = 220000;

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