var tLoginCount = 0;
const tLogin = setInterval(() => {
    if (${escapeCondition}) {
        tLoginCount++;
        log("tLoginCount", tLoginCount)
        return;
    }
    clearInterval(tLogin);
    if (precheck()) return;
    ${loginScript}
}, 1000);
