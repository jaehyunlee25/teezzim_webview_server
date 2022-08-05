function mneCall(date, callback) {
  const as = Array.from(
    document.getElementsByClassName("calenda")[0].getElementsByTagName("a")
  );
  as.forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    if (href === "#") return;
    const obj = procHref(href);
    dates.push([obj.date, obj.param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["SelectedDate"] =
    date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2);

  post("ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr.getElementsByClassName("timeTbl")[0];
    const els = tbl.getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = el.children[0].innerText.gh(2);
log(course);
      const time = el.children[1].innerText;
      if (time.length !== 5) return;
      const fee_normal = el.children[2].innerText.ct(1).split(",").join("") * 1;
      const fee_discount =
        el.children[3].innerText.ct(1).split(",").join("") * 1;

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
function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[0].split("-").join(""), param: "" };
}

/* <============line_div==========> */
mneCall(thisdate, procDate);
