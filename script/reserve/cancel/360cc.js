javascript: (() => {
  ${commonScript}
  const addr = location.href.split("?")[0];
  const year = "${year}";
  const month = "${month}";
  const date = "${date}";
  const course = "${course}";
  const time = "${time}";
  const dict = {
    "${loginUrl}": funcLogin,
    "${reserveUrl}": funcCancel,
  };
  const func = dict[addr];
  if (func) func();
  if(!func) location.href = "${reserveUrl}";
  function funcLogin() {
    ${loginScript}
  }
  function funcCancel() {
    const els = document
      .getElementsByClassName("cm_time_list_tbl")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    let target;
    Array.from(els).forEach((el) => {
      const btn = el.children[3].children[0];
      const [btnTime, , btnDate, , , btnCourse] = btn
        .getAttribute("onclick")
        .inparen();
      const dictCourse = { Out: "OUT", In: "IN" };
      console.log("reserve cancel", course, date, time);
      const fulldate = [year, month, date].join("");
      if (
        btnDate == fulldate &&
        btnCourse == dictCourse[course] &&
        btnTime == time
      )
        target = btn;
    });
    if (target) {
      target.click();
      reservation_cancel_ok();
    }
    const ac = window.AndroidController;
    if (ac) ac.message("end of reserve/cancel");
  }
})();
