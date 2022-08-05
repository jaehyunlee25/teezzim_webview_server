function mneCall(date, callback) {
  const as = Array.from(document.getElementsByClassName("reserve"));
  as.forEach((a, i) => {
    if (i == 0) return;
    const obj = procHref(a.getAttribute("href"));
    dates.push([obj.date, obj.param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$contents$htbArgs"] = strParam;
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$lnkBtnUpd";
  param["__EVENTTARGET"] = "ctl00$contents$lnkBtnUpd";

  post("ReservationCalendar.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr.getElementsByClassName("timeTbl")[0];
    const els = tbl.getElementsByTagName("tr");
    const dictCourse = {
      PARK: "파크",
      VALLEY: "밸리",
    };

    Array.from(els).forEach((el, i) => {
      if (i === 0) return;
      const course = el.children[0].innerText;
      const time = el.children[1].innerText.ct(4);
      const fee_discount =
        el.children[3].innerText.ct(1).split(",").join("") * 1;
      const fee_normal = el.children[3].innerText.ct(1).split(",").join("") * 1;
      const holes = el.children[2].innerText;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: holes,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */
function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: str.split("|")[2].split("-").join(""), param: values[0] };
}

/* <============line_div==========> */
mneCall(thisdate, procDate);
