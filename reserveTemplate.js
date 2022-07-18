javascript:(() => {
    ${commonScript}
    const addr = location.href;
    const dict = {
        "${loginUrl}": funcLogin,
        "${searchUrl}": funcSearch,
    };
    const func = dict[addr];    
    if(!func) location.href = "${searchUrl}";
    else func();
    function funcLogin() {
        ${loginScript}
    };
    function funcSearch() {
        ${reserveScript}
    };
})();