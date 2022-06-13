function mneCall(date, callback) {
  const param = {
    ThisDate: date.gh(4) + "-" + date.ch(4).gh(2) + "-01",
  };
  get("Reservation.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const tds = ifr.getElementsByClassName("reserved");
    Array.from(tds).forEach((td) => {
      if (td.tagName != "TD") return;
      const str = td.children[0].getAttribute("href");
      const vals = procHref(str);
      dates.push([vals.date, ""]);
    });
    callback();
  });
}

function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["strReserveDate"] =
    date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2);
  param["strDayGubun"] = "1";

  post("ReservationTimeList.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const table = ifr.getElementsByClassName("timeTbl")[0];
    const tbody = table.getElementsByTagName("tbody")[0];
    const trs = tbody.children;
    Array.from(trs).forEach((tr) => {
      const course = tr.children[1].innerText;
      const time = tr.children[2].innerText
        .replace(/\s/g, "")
        .split(":")
        .join("");
      const fee_discount = 130000;
      const fee_normal = 130000;

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

function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[1].split("-").join(""), type: "" };
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
