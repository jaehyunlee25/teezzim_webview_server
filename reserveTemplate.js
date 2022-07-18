javascript:(() => {
    ${commonScript}
    const addr = location.href;
    if(addr == "${loginUrl}") {
        ${loginScript}
    } else if (addr == "${searchUrl}") {
        ${reserveScript}
    } else {
        location.href = "${searchUrl}";
    }
})();