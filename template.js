javascript:(() => {
    ${commonScript}
    
    const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
    const aDDr = location.href.split(splitter)[0];
    const suffix = location.href.split(splitter)[1];
    const dictSplitter = {"#": "?", "?": "#"};
    let addr = aDDr;
    if(aDDr.indexOf(dictSplitter[splitter]) != -1) 
        addr = aDDr.split(dictSplitter[splitter])[0];

    log("raw addr :: ", location.href);
    log("aDDr :: ", aDDr);
    log("addr :: ", addr);
        
    if(addr == "${loginUrl}") {
        const tag = localStorage.getItem("TZ_LOGIN");
        if (tag && new Date().getTime() - tag < 1000 * 10) {
            location.href = "${searchUrl}";
            return;
        }
        localStorage.setItem("TZ_LOGIN", new Date().getTime());

        ${loginScript}
    } else if (addr == "${searchUrl}") {
        const tag = lsg("TZ_SEARCH_DATETIME");
        if (tag && new Date().getTime() - tag < 1000 * 10) return;
        lss("TZ_SEARCH_DATETIME", new Date().getTime());

        ${searchScript}
    } else {
        location.href = "${searchUrl}";
    }
})();
