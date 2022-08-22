javascript:(() => {
    ${commonScript}
    const addr = location.href;
    const dict = {
        "${loginUrl}": funcLogin,
        "${reserveUrl}": funcReserve,
    };
    const func = dict[addr];    
    if(!func) location.href = "${reserveUrl}";
    else func();
    function funcLogin() {
        ${loginScript}
    };
    function funcReserve() {
        // ${reserveScript}
    };    
})();