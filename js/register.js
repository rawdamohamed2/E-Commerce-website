const userName = document.getElementById("userName")
const password = document.getElementById("password")
const email = document.getElementById("email")
const signUPBtn = document.getElementById("signUP")


window.onload = function() {
    userName.focus();
  };


signUPBtn.addEventListener("click", function(e){
    e.preventDefault();
    if (userName.value === "" || password.value === "" || email.value === "") {
         alert("please Fill The Empty")        
    } else {
        localStorage.setItem("userName" , userName.value);
        localStorage.setItem("password" , password.value);
        localStorage.setItem("email" , email.value);
        setTimeout(() => {
            window.location = "login.html"
        }, 500);
    }  
})