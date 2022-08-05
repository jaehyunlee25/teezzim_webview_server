function mneCall(strdate, callback) {
  const param = {};
  const els = document.getElementsByClassName("calendar")[0].getElementsByTagName("tbody")[0].getElementsByTagName("button");
  Array.from(els).forEach((el) => {
    const date = procStr(el.getAttribute("onclick")).date;
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
  const dictCourse = {
    C코스: "챌린지",
    M코스: "마스터",
    S코스: "스카이",
  };

  post("/mobile/reserve_step1.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.getElementsByClassName("btn btn-sm book");

    const obTeams = {};
    Array.from(els).forEach((el, i) => {
      const str = el.getAttribute("onclick");
      const regex = /Book_time\((.+)\)/;
      let [, , course, time] = regex
        .exec(str)[1]
        .replace(/'/g, "")
        .split(",");

      course = dictCourse[course.trim()];

      const fee_discount = 135000;
      const fee_normal = 135000;

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
