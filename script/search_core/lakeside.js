function mneCall(date, callback) {
  console.log(date);
  const param = {
    golfResType: "real",
    schDate: date,
    usrMemCd: "21",
    toDay: date + "01",
    calNum: 1,
    inputType: "M",
    recaptchaToken: "",
  };
  post(
    "/reservation/calendar/ajax_realtime_calendar_view.do",
    param,
    {},
    (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;

      const as = ifr.getElementsByTagName("a");
      Array.from(as).forEach((a) => {
        const str = a.getAttribute("href");
        if (str.indexOf("javascript:timefrom_change(") === -1) return;
        const ob = procStr(str);
        if (!ob.available) return;
        dates.push([ob.date, 0]);
      });
      callback();
    }
  );
}

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    golfResType: "real",
    courseId: 0,
    courseIdM: 0,
    courseIdS: 0,
    usrMemCd: 21,
    pointDate: date,
    openYn: 1,
    dateGbn: "",
    choiceTime: "00",
    cssncourseum: "",
    inputType: "",
  };
  post("/reservation/list/ajax_real_timeinfo_list.do", param, {}, (data) => {
    callbackNumber++;
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName("tr");
    Array.from(trs).forEach((tr, i) => {
      if (i === 0) return;
      const tds = tr.children;
      const time = tds[1].innerHTML;
      const course = tds[2].innerHTML.gh(1);
      const inOut = tds[2].innerHTML;
      const fee_normal = tds[4].innerText.replace(/\,/g, "") * 1;
      const fee_discount = tds[5].innerText.replace(/\,/g, "") * 1;
      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: inOut,
        persons: "",
        fee_normal,
        fee_discount,
        others: "18홀",
      });
    });
    procDate();
  });
}

function procStr(str) {
  const regex = /javascript:timefrom_change\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[0], available: values[5] === "T" };
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
