let commonToken = (function () {
    let headImg, loginText, powerTetx, username, loginHead, logoutHead;
    
    function commonInit() {
        headImg = window.parent.document.querySelector(".user-head-img");
        powerTetx = window.parent.document.querySelector(".text-xs span");
        username = window.parent.document.querySelector(".m-t-xs strong");
        loginHead = window.parent.document.querySelector(".nav-header .login");
        logoutHead = window.parent.document.querySelector(".nav-header .logout");
    
        commontoken();
    }
    
    function commontoken() {
        let data = $.get("http://10.9.47.242:3000/tokenlogin", commonsetUser, "json");
    }
    
    function commonsetUser(result) {
        console.log(result);
        if (result.type === "succeed") {
            loginHead.style.display = "block";
            logoutHead.style.display = "none";
            powerTetx.textContent = result.detail.value.power;
            username.textContent = result.detail.value.name;
            headImg.style.backgroundImage = `url(${result.detail.value.headImg})`;
        } else {
            loginHead.style.display = "none";
            logoutHead.style.display = "block";
        }
    }
    return commonInit;
})()

