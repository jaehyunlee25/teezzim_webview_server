var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
    if (${escapeCondition}) {
        tLoginCount++;
        log("tLoginCount", tLoginCount);
        if(tLoginCount > 4) clearInterval(tLogin);
        return;
    }
    clearInterval(tLogin);
    if (precheck()) return;
    ${loginScript}
}
