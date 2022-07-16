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

    const trs1 = (() => {
      let target;
      Array.from(ifr.getElementsByTagName("div")).forEach((div) => {
        if (div.id == "Table_1") target = div;
      });
      return Array.from(target.getElementsByTagName("input"));
    })();
    const trs2 = (() => {
      let target;
      Array.from(ifr.getElementsByTagName("div")).forEach((div) => {
        if (div.id == "Table_2") target = div;
      });
      return Array.from(target.getElementsByTagName("input"));
    })();

    trs1.forEach((el, i) => {
      if (i === 0) return;
      const td = el.children[0];
      const course = "Out";
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