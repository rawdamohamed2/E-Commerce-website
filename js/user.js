const userInfo = document.getElementById("userInfo");
const user = document.getElementById("user");
const links = document.getElementById("links");
const getuserName = sessionStorage.getItem("userName");

if (getuserName) {
    links.remove();
    user.style.display = 'block';
    userInfo.style.display = "flex";
    user.innerHTML = "Welcome " + getuserName;
}

let logOutBtn = document.getElementById("logOut")
logOutBtn.addEventListener("click",logOut)
function logOut() {
 localStorage.clear();
    setTimeout(() => {
        window.location = "index.html"
    }, 500);

}