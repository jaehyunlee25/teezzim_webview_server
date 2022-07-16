function mneCall(strdate, callback) {
  const param = {};
  const els = document.getElementsByClassName("calendar")[0].getElementsByTagName("tbody")[0].getElementsByTagName("button");
  Array.from(els).forEach((el) => {
    const date = procStr(el.getAttribute("onclick"));
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {
    book_date: date,
    index: "86201",
  };
  const courseDict = {
    IN: "In",
    OUT: "Out",
  };

  post("/mobile/reservation/list/ajax_real_timeinfo_list.do", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr
      .getElementsByClassName("cm_time_list_tbl")[0]
      .getElementsByTagName("tbody")[0];
    const els = tbl.getElementsByTagName("tr");

    const obTeams = {};
    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = courseDict[el.children[1].innerText];
      const time = el.children[2].innerText;
      const fee_discount = el.children[4].innerText.split(",").join("") * 1;
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
        others: "9홀",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */
function procStr(str) {
  const regex = /Date_Click\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values.join("") };
}
/* <============line_div==========> */
mneCall(thisdate, procDate);
