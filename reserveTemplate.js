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
    };
    const func = dict[addr];    
    if(!func) location.href = "${searchUrl}";
    else func();
    function funcLogin() {
        ${loginScript}
    };
    function funcReserve() {
        ${reserveScript}
    };    
})();