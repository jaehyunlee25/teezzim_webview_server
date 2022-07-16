function mneCall(date, callback) {
  const param = {
    ThisDate: [date.gh(4), date.gt(2), "01"].join("-"),
  };
  get("/Mobile/reservation/reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const table = ifr.getElementsByClassName("tbl02")[0];
    const thead = table.getElementsByTagName("thead")[0];
    const as = thead.getElementsByClassName("r_choice");

    Array.from(as).forEach((a) => {
      const num = a.innerText.addzero();
      const fulldate = date + num;
      dates.push([fulldate, 0]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {};
  const courseDict = {
    11: "Out",
    22: "In",
  };
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));

  param["Choice_Date"] = [date.gh(4), date.ch(4).gh(2), date.gt(2)].join("-");

  post("/Mobile/reservation/ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs1 = ifr
      .getElementsByClassName("tbl02")[0]
      .children[1].getElementsByTagName("tbody")[0].children;
    const trs2 = ifr
      .getElementsByClassName("tbl02")[0]
      .children[1].getElementsByTagName("tbody")[1].children;
    const els = Array.from(trs1).concat(Array.from(trs2));

    els.forEach((el, i) => {
      if (i === 0) return;
      const td = el.children[0];
      const courseCode = td.children[3].children[0]
        .getAttribute("href")
        .inparen()[2];
      const course = courseDict[courseCode];
      const time = td.children[0].innerText;
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
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
    mneCall(nextdate, procDate);  
});
