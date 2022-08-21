function mneCall(date, callback) {
  const param = {
    mode: "mobile",
    day: date.gh(4) + "/" + date.ch(4).gh(2) + "/" + "01",
    type: "",
    changeDate: "",
    changeSeq: "",
  };
  post("AjaxCalendar", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const tds = ifr.getElementsByClassName("reserv");
    Array.from(tds).forEach((td) => {
      const strDate = td.getAttribute("data-day");
      dates.push([strDate, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    mode: "mobile",
    date: date,
    changeDate: "",
    changeSeq: "",
    course: "",
  };

  post("AjaxTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const table = ifr.getElementsByClassName("tbl02")[0];
    const tbody = table.getElementsByTagName("tbody")[0];
    const trs = tbody.children;
    Array.from(trs).forEach((tr) => {
      const course = tr.getAttribute("data-coursekor");
      const time = tr.children[1].innerText
        .replace(/\s/g, "")
        .split(":")
        .join("");
      const fee_discount = 150000;
      const fee_normal = 150000;

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

/* <============line_div==========> */

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
