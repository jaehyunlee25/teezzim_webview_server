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
      const [btnTime, , btnDate, , , btnCourse] = el.children[3].children[0]
        .getAttribute("onclick")
        .inparen();
      console.log("reserve cancel", course, date, time);
      const fulldate = [year, month, date].join("");
      if (btnDate == fulldate && btnCourse == course && btnTime == time)
        target = el;
    });
    if (target) target.click();
    const ac = window.AndroidController;
    if (ac) ac.message("end of reserve/cancel");
  }
})();
