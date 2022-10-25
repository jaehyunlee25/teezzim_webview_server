try{
login_id.value = '${login_id}';
login_pw.value = '${login_password}';
chkLogValue(frmLogin,'in',frmLogin.mem_id,frmLogin.usr_pwd);
} catch(e) {
location.href = "http://www.ferrumclub.com/m/reservation/live.asp";
}
