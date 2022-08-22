function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$scManager"] =
    "ctl00$ContentPlaceHolder1$scManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$hdfParam"] =
    "CALENDAR|" + date.gh(4) + "-" + date.ch(4).gh(2) + "-01|";
  param["__ASYNCPOST"] = true;
  post("Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const as = ifr.getElementsByClassName("reserv");
    Array.from(as).forEach((a) => {
      const str = a.getAttribute("href");
      const vals = procHref(str);
      dates.push([vals.date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$scManager"] =
    "ctl00$ContentPlaceHolder1$scManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$hdfParam"] =
    "CALENDAR|" + date.gh(4) + "-" + date.ch(4).gh(2) + "-01|";
  param["SelectedDate"] =
    date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2);
  param["__ASYNCPOST"] = true;

  post("ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const table = ifr.getElementsByClassName("timeTbl")[0];
    const tbody = table.getElementsByTagName("tbody")[0];
    const trs = tbody.children;
    Array.from(trs).forEach((tr) => {
      const course = tr.children[0].innerText;
      const time = tr.children[1].innerText
        .gh(5)
        .replace(/\s/g, "")
        .split(":")
        .join("");
      const fee_discount =
        tr.children[3].innerText.replace(/\s/g, "").ct(1).split(",").join("") *
        1;
      const fee_normal =
        tr.children[4].innerText.replace(/\s/g, "").ct(1).split(",").join("") *
        1;

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
  return { date: values[0].split("-").join(""), type: "" };
}

/* <============line_div==========> */

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
