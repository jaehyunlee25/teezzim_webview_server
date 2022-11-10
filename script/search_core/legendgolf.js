function mneCall(date, callback) {
  const param = {
    ThisDate: (date + "01").datify(),
  };
  get("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.gba("href", "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      let [str, date, sign] = el.attr("href").inparen();
      if(str != "") return;
      dates.push([date.rm("-"), sign]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, sign] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["Choice_Date"] = date.datify();
  param["Day_Gubun"] = sign;
  param["strReserveType"] = "1";

  const arr = ["1", "2", "3", "4"];
  exec();

  function exec() {
    const num = arr.shift();
    if (!num) {
      procDate();
      return;
    }
    param["strSearchBu"] = num;
    post("/Mobile/Reservation/ReservationTimeList.aspx", param, {}, (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;

      const dictCourse = {
        1: "단일",
      };
      const els = ifr.gba("href", "javascript:Reserve", true);
      Array.from(els).forEach((el) => {
        let [date, time, , , , hole] = el.attr("href").inparen();
        hole = hole + "홀";
        date = date.rm("-");
        const course = dictCourse[1];
        const fee_discount = 100000;
        const fee_normal = 100000;

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
      exec();
    });
  }
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
