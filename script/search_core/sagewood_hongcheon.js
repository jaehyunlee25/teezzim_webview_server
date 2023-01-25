function mneCall(date, callback) {
  EXTZLOG("search", "mneCall");
  const res = {};
  let els = doc.gcn("valid");
  Array.from(els).forEach((el, i) => {
    if (el.children.length == 0) return;
    const time = el.attr("time") * 1;
    const day = new Date(time);
    const year = day.getFullYear();
    const month = ((day.getMonth() + 1) + "").addzero();
    const dt = (day.getDate() + "").addzero();
    res[[year, month, dt].join("")] = true;
  });
  doc.gcn("btn_calendar_next")[0].click();
  els = doc.gcn("valid");
  Array.from(els).forEach((el, i) => {
    if (el.children.length == 0) return;
    const time = el.attr("time") * 1;
    const day = new Date(time);
    const year = day.getFullYear();
    const month = ((day.getMonth() + 1) + "").addzero();
    const dt = (day.getDate() + "").addzero();
    res[[year, month, dt].join("")] = true;
  });
  Object.keys(res).forEach((date) => {
    dates.push([date, ""]);
  });
  doc.gcn("btn_calendar_next")[0].click();
  els = doc.gcn("valid");
  Array.from(els).forEach((el, i) => {
    if (el.children.length == 0) return;
    const time = el.attr("time") * 1;
    const day = new Date(time);
    const year = day.getFullYear();
    const month = ((day.getMonth() + 1) + "").addzero();
    const dt = (day.getDate() + "").addzero();
    res[[year, month, dt].join("")] = true;
  });
  EXTZLOG("search", Object.keys(res).length);
  const distinct = {};
  Object.keys(res).forEach((date) => {
    if (distinct[date]) return;
    distinct[date] = true;
    EXTZLOG("search", date);
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
const distinct = {};
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/global/reservation/ajax/ajax_real_timeinfo_list";
  const method = "post";
  const param = {
    companyCd: "J07",
    bookgDate: date,
    bookgCourse: "0",
    courseId: "0",
    bookgTime: "",
    cmd: "",
    cmKind: "",
    atype: "",
    bookgNo: "",
    bookgCnt: "4",
    email: "",
    gubun: "BOOKG",
    gcGubun: "G",
    pkgCode: "",
    pkgGubun: "02",
    pkgName: "",
    pkgGolfAmt: "",
    pkgGolfCnt: "",
    pkgStoreAmt: "",
    pkgTotAmt: "",
    bookgGreenFee: "",
    birthDay: "",
    sexCd: "",
    memberName: "",
    pNationCd: "",
    noMemberHandTel: "",
    userDi: "",
    userCi: "",
    ssnKind: "",
    oldCompanyCd: "",
    oldBookgCourse: "",
    oldBookgTime: "",
    oldBookgDate: "",
    oldBookgNo: "",
    oldBookgSeq: "0",
    oldGubun: "",
    oldGcGubun: "",
    stateGubun: "",
    memberNo: "99993468",
    selfRyn: "",
    selfCyn: "",
  };
  const dictCourse = {
    1: "Dream",
    2: "Vision",
    3: "Challenge",
  };

  fCall[method](addr, param, {}, (data) => {
    EXTZLOG("mneCall", "ajax callback");
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "golfTimeSelect", true);
    Array.from(els).forEach((el) => {
      let [date, , time, fee, course] = el.attr("onclick").inparen(true);
      time = time.trim();
      date = date.rm(".");
      course = dictCourse[course.trim()];
      const hole = 18;
      fee_normal = fee.rm(",") * 1;
      fee_discount = fee.rm(",") * 1;

      if (distinct[date + time + course]) return;
      distinct[date + time + course] = true;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole + "홀",
      });
    });
    EXTZLOG("mneCall", "golf_schedule count : " + golf_schedule.length);
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
