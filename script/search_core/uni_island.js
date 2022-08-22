function mneCall(date, callback) {
  const els = document.getElementsByTagName("a");
  Array.from(els).forEach((el) => {
    const obj = procHref(el.href.toString());
    if (obj === undefined) return;
    dates.push([obj.date, obj.param]);
  });
  callback();
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$htbArgs"] = strParam;
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btUp";

  post("Reservation.aspx?choiceGolf=160", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr.getElementsByClassName("timeTbl")[0];
    const els = tbl.getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (i === 0) return;

      const course = el.children[0].innerText;
      const time = el.children[1].innerText;
      const fee_normal = el.children[3].innerText.ct(1).split(",").join("") * 1;
      const fee_discount =
        el.children[4].innerText.ct(1).split(",").join("") * 1;
      const caddy = el.children[2].innerText;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "9홀/" + caddy,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

function procHref(str) {
  if (str.indexOf("javascript:Update('LIST") === -1) return;
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: str.split("|")[2].split("-").join(""), param: values[0] };
}

/* <============line_div==========> */

mneCall(thisdate, () => {
  Update(
    "CALENDAR|" + nextdate.gh(4) + "-" + nextdate.ch(4).gh(2) + "-" + "01|"
  );
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 3000);
});
