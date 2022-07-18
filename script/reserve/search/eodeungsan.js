javascript:(() => {
    ${commonScript}
    const addr = location.href;
    const dict = {
        "${loginUrl}": funcLogin,
        "${reserveUrl}": funcReserve,
        "https://www.eodeungsancc.com/mobile/index.asp": funcGo,
    };
    const func = dict[addr];    
    if(func) func();
    function funcLogin() {
        ${loginScript}
    };
    function funcGo() {
        location.href = "${reserveUrl}";
    }
    function funcReserve() {
        const els = document.getElementsByClassName("btn btn-sm btn-gray");
        const result = [];
        Array.from(els).forEach(el => {
            const [date,,course,time] = el.getAttribute("onclick").inparen();
            console.log("reserve search", course, date, time);
            result.push({ date, time, course });
        });
        const param = {
            golf_club_id: "${golfClubId}",
            result,
        };
        const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
        post(addr, param, { "Content-Type": "application/json" }, (data) => {
            console.log(data);
        });
        const ac = window.AndroidController;
        if (ac) ac.message("end of reserve/search");
    };
})();