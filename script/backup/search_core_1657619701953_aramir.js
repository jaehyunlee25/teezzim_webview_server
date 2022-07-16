function mneCall(date, callback) {
  const param = {
    ThisDate: [date.gh(4), date.gt(2)].join("-") + "-01",
  };
  post("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByClassName("tbl02")[0]
      .getElementsByClassName("r_choice");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("href").inparen();
      const fulldate = param[1].split("-").join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {};
  const dictCourse = {
    "아라 IN": "ara_in",
    "아라 OUT": "ara_out",
    "미르 IN": "mir_in",
    "미르 OUT": "mir_in",
  };
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["Choice_Date"] = [date.gh(4), date.ch(4).gh(2), date.gt(2)].join("-");
  param["Day_Gubun"] = options[2];
  post("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("tbl02")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = dictCourse[el.children[0].innerText];
      const time = el.children[2].innerText;
      const fee_normal = el.children[2].innerText.split(",").join("") * 1;
      const fee_discount = el.children[2].innerText.split(",").join("") * 1;

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
mneCall(thisdate, () => {  
  mneCall(nextdate, procDate);
});