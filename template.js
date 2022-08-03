javascript:(() => {
    ${commonScript}
    const addr = location.href;
    if(addr == "${loginUrl}") {
        const tag = localStorage.getItem("TZ_LOGIN");
        if (tag && new Date().getTime() - tag < 1000 * 10) {
            location.href = "${searchUrl}";
            return;
        }
        localStorage.setItem("TZ_LOGIN", new Date().getTime());

        ${loginScript}
    } else if (addr == "${searchUrl}") {
        ${searchScript}
    } else {
        location.href = "${searchUrl}";
    }
})();
