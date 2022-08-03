function funcLogin() {
  log("funcLogin");
  
  const tag = localStorage.getItem("TZ_LOGIN");
  if (tag && new Date().getTime() - tag < 1000 * 10) {
    if(funcEnd) funcEnd();
    return;
  }
  localStorage.setItem("TZ_LOGIN", new Date().getTime());

  ${loginScript}

  return;
}