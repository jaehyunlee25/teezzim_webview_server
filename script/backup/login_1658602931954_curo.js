try{
  userId1.value = '${login_id}';
  userPw1.value = '${login_password}';
  Login_Check();
}catch(e){
  location.href = "http://www.curocc.com/mobile/reservation_01.asp";
}
