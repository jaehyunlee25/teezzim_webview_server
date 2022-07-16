function mneCall(date, callback) {
  const els = document.getElementsByClassName("cm_liv");
  Array.from(els).forEach((el) => {
    const fulldate = el.innerText.split("-").join("");
    dates.push([fulldate, 0]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    backurl: "/_mobile/GolfRes/onepage/real_reservation.asp?",
    pointdate: date,
    openyn: "2",
    dategbn: option[2],
    settype: "P",
  };
  post("/_mobile/GolfRes/onepage/real_reservation.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("cm_time_live_tab_list")[0]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = "단일";
      const time = el.children[2].innerText;
      const fee_normal = el.children[4].innerText.split(",").join("") * 1;
      const fee_discount = el.children[5].innerText.split(",").join("") * 1;

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