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
        ${reserveScript}
    };
    function funcExec() {
        ${reserveScript}
    };
})();