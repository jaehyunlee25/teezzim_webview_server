(() => {
    ${commonScript}
    const addr = location.href;
    if(addr == "${loginUrl}") {
        ${loginScript}
    } else if (addr == "${searchUrl}") {
        ${searchScript}
    } else {
        location.href = "${searchUrl}";
    }
})();