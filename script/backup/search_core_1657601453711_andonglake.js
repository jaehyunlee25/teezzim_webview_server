function mneCall(date, callback) {
  const els = ReservationDate.getElementsByTagName("a");
  Array.from(els).forEach((el) => {
    const fulldate = el.innerText.split("-").join("");
    dates.push([fulldate, 0]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    Date: [date.gh(4), date.ch(4).gh(2), date.gt(2)].join("-"),
  };
  get("/BookingAdd.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    document.body.appendChild(ifr);

    const trs1 = document
      .getElementById("Table_1")
      .getElementsByTagName("input");
    const trs2 = document
      .getElementById("Table_2")
      .getElementsByTagName("input");

    trs1.forEach((el, i) => {
      if (i === 0) return;
      const td = el.children[0];
      const course = "Out";
      const time = el.value;
      const fee_discount = td.children[2].innerText.split(",").join("") * 1;
      const fee_normal = td.children[2].innerText.split(",").join("") * 1;

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

    trs2.forEach((el, i) => {
      if (i === 0) return;
      const td = el.children[0];
      const course = "In";
      const time = el.value;
      const fee_discount = 300000;
      const fee_normal = 300000;

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