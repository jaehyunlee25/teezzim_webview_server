function mneCall(strdate, callback) {
  const param = {};
  const els = document.getElementsByClassName("booking-calendar")[0].getElementsByTagName("a");
  Array.from(els).forEach((el) => {
    const date = el.getAttribute("data-date");
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {};

  get("/public/booking/time/" + date, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("cm_time_list_tbl")[0]
      .getElementsByTagName("tbody")[0].children;

    const obTeams = {};
    Array.from(els).forEach((el, i) => {
      const course = '단일';
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

/* <============line_div==========> */
mneCall(thisdate, procDate);