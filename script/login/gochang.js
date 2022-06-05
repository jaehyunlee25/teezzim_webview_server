(() => {
    const els = document.getElementsByClassName("form-control");
    els[0].value = '${login_id}';
    els[1].value = '${login_password}';
    Login1();
})()