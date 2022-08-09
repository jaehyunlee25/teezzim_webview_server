function mneCall(date, callback) {
  const param = {
    day: (date + "01").datify("/"),
    type: "today",
  };
  post("Booking/AjaxCalendar", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.getElementsByTagName("td");
    Array.from(els).forEach((el) => {
      if (el.children[0].tagName !== "A") return;
      if (el.children[0].className !== "reserved") return;

      const realdate =
        date.split("/").join("").ct(2) + el.children[0].innerText.addzero();
      dates.push([realdate, 0]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    day: date,
    course: "",
  };
  post("Booking/SelectTime", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.getElementsByTagName("tr");
    const dictCourse = { 11: "Australasia", 22: "Europe", 33: "USA" };
    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = dictCourse[el.getAttribute("data-course")];
      const time = el.children[2].innerText.split(":").join("");
      const fee_discount = el.children[4].innerText.split(",").join("") * 1;
      const fee_normal = el.children[3].innerText.split(",").join("") * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  change_calendar(thisdate, "next");
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 3000);
});
