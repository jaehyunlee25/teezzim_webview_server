javascript:(() => {
    ${commonScript}
    const addr = location.href;
    const dict = {
        "${loginUrl}": funcLogin,
        "${reserveUrl}": funcReserve,
    };
    const func = dict[addr];    
    if(func) func();
    function funcLogin() {
        ${loginScript}
    };
    function funcReserve() {
        const els = document
            .getElementsByClassName("cm_time_list_tbl")[0]
            .getElementsByTagName("tbody")[0]
            .getElementsByTagName("tr");
        const result = [];
        const dictCourse = {
            OUT: "Out",
            IN: "IN",
        };
        Array.from(els).forEach((el) => {
            const [time, , date, , , course] = el.children[3].children[0]
                .getAttribute("onclick")
                .inparen();
            console.log("reserve search", dictCourse[course], date, time);
            result.push({ date, time, course: dictCourse[course] });
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
        });
    };
})();