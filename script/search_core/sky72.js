function mneCall(callback) {
  const trs = Array.from(list_d2.getElementsByTagName("tr"));
  const result = [];
  const dict = { 1: "A", 2: "B", 3: "C", 4: "D" };
  trs.forEach((tr) => {
    const date = tr.getAttribute("dt1");
    Array.from(tr.children).forEach((td, i) => {
      if (i === 0) return;
      if (i > 4) return;
      if (td.innerText === "") result.push([date, dict[i]]);
    });
  });
  result.forEach((arr) => {
    dates.push(arr);
  });
  callback();
}

function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    resTabno: "1",
    weekNo: "1",
    wdate: date,
    wcrs: course,
    weekgb: "",
    flagcd2: "7",
    holecd: "2",
    eventGB: "",
    eventGB2: "",
    tgtUrl: "",
    date: "",
    roundDiv: "",
    gb: "D",
    enc: "",
    cmd: "",
  };

  post("real_step02.jsp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.getElementsByClassName("timeListCls");
    Array.from(els).forEach((el, i) => {
      const time = el.getAttribute("d2");
      const fee_discount = el.children[1].innerText.split(",").join("") * 1;
      const fee_normal = el.children[1].innerText.split(",").join("") * 1;

      console.log(date, course, time, fee_discount, fee_normal);

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

mneCall(procDate);
