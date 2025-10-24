const userName = document.getElementById("userName");
const password = document.getElementById("password");
const signInBtn = document.getElementById("signIn");

const getUserName = localStorage.getItem("userName");
const getPassword = localStorage.getItem("password");


window.onload = function() {
    userName.focus();
  };

signInBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (userName.value === "" || password.value === "") {
        alert("Fill Your Data");
    } else {
        if (getUserName && getUserName.trim() === userName.value.trim() && getPassword && getPassword.trim() === password.value.trim()) {
            setTimeout(() => {
                window.location = "index.html"
            }, 500)
        } else {
            alert("password or username is not valid")
        }
    }
})



