javascript: (() => {
  ${commonScript}

  const dict = ${address_mapping};

  function precheck() {}
  function funcLogin() {
    EXTZLOG("search", "funcLogin");

    const chk = LSCHK("TZ_SEARCH_LOGIN" + clubId, 5);
    if (!chk) {
      EXTZLOG("search", "funcLogin Timein ERROR");
      location.href = "${searchUrl}";
      return;
    }

    ${loginScript}

    return;
  }

  ${searchCommonScript}

  function main() {
    EXTZLOG("search", "main");

    if (!TZ_BOT_SAFETY) {
      EXTZLOG("search", "stopped by Infinite Call");
      return;
    }

    const func = dict[addr];
    if (!func) funcOther();
    else func();
  }

  function funcList() {
    EXTZLOG("search", "funcList");
    location.href = "${searchUrl}";
    return;
  }
  function funcMain() {
    EXTZLOG("search", "funcMain");

    const chk = LSCHK("TZ_SEARCH_MAIN" + clubId, 10);
    EXTZLOG("search", ["timeout chk", chk].join(", "));

    if (!chk) {
      EXTZLOG("search", "funcMain Timein ERROR");
      return;
    }

    location.href = "${searchUrl}";
    return;
  }
  function funcOut() {
    EXTZLOG("search", "funcOut");

    funcEnd();

    return;
  }
  function funcOther() {
    EXTZLOG("search", "funcOther");

    const chk = LSCHK("TZ_SEARCH_OTHER" + clubId, 10);
    EXTZLOG("search", ["timeout chk", chk]);
    if (!chk) {
      log("funcOther Timein ERROR");
      return;
    }

    location.href = "${searchUrl}";

    return;
  }
  function funcReserve() {
    EXTZLOG("search", "funcSearch");

    if (location.href == addr) {
      const chk = LSCHK("TZ_SEARCH_RESERVE" + clubId, 5);
      EXTZLOG("search", ["timeout chk", chk]);
      if (!chk) {
        EXTZLOG("search", "funcSearch Timein ERROR");
        return;
      }
    }

    ${searchScript}

    return;
  }

  main();
})();
