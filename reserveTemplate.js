javascript:(() => {
    ${commonScript}
    const addr = location.href;
    const dict = {
        "${loginUrl}": funcLogin,
        "${searchUrl}": funcSearch,
    };
    const func = dict[addr];
    function funcLogin() {
        ${loginScript}
    };
    function funcSearch() {
        ${reserveScript}
    };
    if(!func) location.href = "${searchUrl}";
})();