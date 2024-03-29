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

    const els = ifr.gba("href", "javascript:Reserve", true);
    els.forEach((el, i) => {
      let [date, time, course, , , hole] = el.attr("href").inparen();
      date = date.rm("-");
      course = courseDict[course];
      const fee_discount = el.nm(2, 2).str().split(",").join("") * 1;
      const fee_normal = el.nm(2, 2).str().split(",").join("") * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole + "홀",
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
