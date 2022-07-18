javascript:(() => {
    ${commonScript}
    const addr = location.href;
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