function mneCall(date, callback) {
  const param = {
    strYY: date.gh(4),
    strMM: date.ch(4).gh(2) * 1,
    strReserveType: "1",
    strReserveDate: "",
    strReserveTime: "",
    strCourseCode: "",
    strDayGubun: "",
    strHole: "",
    strSeq: "",
    strBu: "",
    strTotalCnt: "",
    strPrevDL: "",
    strPrevTD: "",
    strPrevReserveType: "",
    dtmChangeDate: "",
    strChangeTime: "",
    strChangeSeq: "",
    strChangeDayGubun: "",
    strChangeCode: "",
    strChangeHole: "",
  };
  post("Reservation.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const spans = ifr.getElementsByClassName("choice");
    Array.from(spans).forEach((span) => {
      const el = span.children[0];
      if (el.tagName != "A") return;
      const str = el.getAttribute("href");
      const vals = procHref(str);
      log(vals.date.charCodeAt(0));
      dates.push([vals.date.ch(1), ""]);
    });
    log(dates);
    callback();
  });
}

function mneCallDetail(arrDate) {
  const [date, course] = arrDate;

  const param = {
    strYY: date.gh(4),
    strMM: date.ch(4).gh(2) * 1,
    strReserveType: "1",
    strReserveDate: date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2),
    strReserveTime: "",
    strCourseCode: "",
    strDayGubun: "2",
    strHole: "",
    strSeq: "",
    strBu: "",
    strTotalCnt: "",
    strPrevDL: "",
    strPrevTD: "",
    strPrevReserveType: "1",
    dtmChangeDate: "",
    strChangeTime: "",
    strChangeSeq: "",
    strChangeDayGubun: "",
    strChangeCode: "",
    strChangeHole: "",
  };

  post("ReservationTimeList.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const table = ifr.getElementsByClassName("tbl_reserlist")[0];
    const tbody = table.getElementsByTagName("tbody")[0];
    const trs = tbody.children;
    Array.from(trs).forEach((tr) => {
      const course = tr.children[0].innerText.replace(/\s/g, "");
      if (!course) return;
      const time = tr.children[2].innerText
        .replace(/\s/g, "")
        .gh(5)
        .split(":")
        .join("");
      const fee_discount =
        tr.children[3].innerText.replace(/\s/g, "").ct(4).split(",").join("") *
        1;
      const fee_normal =
        tr.children[3].innerText.replace(/\s/g, "").ct(4).split(",").join("") *
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

function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[1].split("-").join(""), type: "" };
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
