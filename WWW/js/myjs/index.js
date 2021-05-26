let headImg,loginText,powerTetx,username,loginHead,logoutHead;


init();

function init() {
    headImg=document.querySelector(".user-head-img");
    powerTetx=document.querySelector(".text-xs span");
    username=document.querySelector(".m-t-xs strong");
    loginHead=document.querySelector(".nav-header .login");
    logoutHead=document.querySelector(".nav-header .logout");
    
    token();
}

// serve-timer

function token() {
    let data =$.get("http://10.9.47.242:3000/tokenlogin",setUser,"json");
}

function setUser(result) {
    if (result.type==="succeed") {
        loginHead.style.display="block";
        logoutHead.style.display="none";
        headImg.style.backgroundImage = `url(${result.detail.value.headImg})`;
        powerTetx.textContent = result.detail.value.power;
        username.textContent = result.detail.value.name;
    }else{
        loginHead.style.display="none";
        logoutHead.style.display="block";
        location.href="http://10.9.47.242:3000/notlogin.html"
    }
}