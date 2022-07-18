javascript:(() => {
    ${commonScript}
    const addr = location.href;
    const year = "${year}";
    const month = "${month}";
    const date = "${date}";
    const course = "${course}";
    const time = "${time}";
    const dict = {
        "${loginUrl}": funcLogin,
        "${searchUrl}": funcReserve,
        "https://www.eodeungsancc.com/mobile/reservation_02.asp": funcTime,
        "https://www.eodeungsancc.com/mobile/reservation_03.asp": funcExec,
    };
    const func = dict[addr];    
    if(!func) location.href = "${searchUrl}";
    else func();
    function funcLogin() {
        ${loginScript}
    };
    function funcReserve() {
        Date_Click(year, month, date);
    };
    function funcTime() {
        const fulldate = [year, month, date].join("");
        const dictCourse = {어등: "1", 송정: "2", "하남": "3"};
        Book_Confirm(fulldate,'',dictCourse[course], course,time,'2');
    };
    function funcExec() {
        document.getElementsByClassName("btn_reserve")[0].click();
    };
})();