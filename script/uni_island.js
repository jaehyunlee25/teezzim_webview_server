(() => {
    ctl00_ContentPlaceHolder1_UserID.value = '${login_id}';
    ctl00_ContentPlaceHolder1_UserPassword.value = '${login_password}';
    btnLogin.click();
})()