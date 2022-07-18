javascript:(() => {
    ${commonScript}
    const addr = location.href;
    const year = "${year}";
    const month = "${month}";
    const date = "${date}";
    const course = "${course}";
    const time = "${time}";
    const dict = {
        "${loginUrl}": funcLogin,
        "${reserveUrl}": funcCancel,
        "https://www.eodeungsancc.com/mobile/index.asp": funcGo,
    };
    const func = dict[addr];    
    if(!func) location.href = "${reserveUrl}";
    else func();
    function funcLogin() {
        ${loginScript}
    };
    function funcGo() {
        location.href = "${reserveUrl}";
    }
    function funcCancel() {
        const els = document.getElementsByClassName("btn btn-sm btn-gray");
        let target;
        Array.from(els).forEach(el => {
            const [btnDate,,btnCourse,btnTime] = el.getAttribute("onclick").inparen();
            console.log("reserve cancel", course, date, time);
            const fulldate = [year, month, date].join("");
            if(btnDate == fulldate && btnCourse == course && btnTime == time) target = el;
        });
        // if(target) target.click();
        const ac = window.AndroidController;
        if (ac) ac.message("end of reserve/cancel");
    };
})();