(() => {
    ctl00_ContentPlaceHolder1_userID.value = '${login_id}';
    ctl00_ContentPlaceHolder1_userPass.value = '${login_password}';
    loginTrigger();
})();