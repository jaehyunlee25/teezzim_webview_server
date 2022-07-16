function mneCall(date, callback) {
  const param = {
    ThisDate: date,
  };
  get("/mobile/reserve.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("btn btn-sm book");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      const fulldate = [param[0], param[1], param[2]].join("");
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    1: "Pine",
    2: "Lake",
    3: "Field",
    4: "Valley",
    5: "Mountain",
  };
  let count = 1;
  exec();
  function exec() {
    if (count === 5) {
      procDate();
      return;
    }
    const param = {
      book_date: date,
      book_crs: count,
    };
    post("/mobile/reserve_step1.asp", param, {}, (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;

      const els = ifr.getElementsByClassName("btn btn-sm book");
      Array.from(els).forEach((el, i) => {
        if (i == 0) return;
        const param = el.getAttribute("onclick").inparen();
        const course = dictCourse[count];
        const time = param[1];
        let fee_normal = 190000;
        let fee_discount = 190000;

        if (isNaN(fee_normal)) fee_normal = -1;
        if (isNaN(fee_discount)) fee_discount = -1;

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
      count++;
      exec();
    });
  }
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
