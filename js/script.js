const noInternet = document.getElementById('noInternet');
const productsContainer = document.getElementById("products");
const allProducts = document.getElementById(".products");
const buyProduct = document.getElementById("buyProduct");
const totalPrice = document.getElementById("totalPrice");
const badge = document.getElementById("badge");
const searchOption = document.getElementById("searchOption");
const searchInput = document.getElementById("search");

const getUserName = localStorage.getItem("userName");
const productsIncart = JSON.parse(localStorage.getItem(`proudectInCart`))||[];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = +localStorage.getItem("totalPrice") || 0;
let favs = JSON.parse(localStorage.getItem("favs")) || [];

let productsList = [];
let searchMode = "title";

// ------------------------------- noInternet -----------------------------------
window.addEventListener("load", updateConnectionStatus);
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
function updateConnectionStatus() {
    noInternet.style.display = navigator.onLine ? "none" : "block";
}

// ------------------- Fetch Products -------------------
async function getProducts (){
    try {
        let response = await fetch("Data/products.json");
        let results = await response.json();
        productsList = results.products;
        renderProducts(productsList);
        restoreCartUI();
    } catch (error) {
        alert(error);
    }
}
getProducts ();

// ------------------- Render Products -------------------
function renderProducts(productsList){
    productsContainer.innerHTML = productsList.map(product => createProductCard(product)).join('');
    attachProductEvents();
}
function createProductCard (item){
    const inCart = cart.find(Product => Product.id === item.id);
    const isFavorite = favs.find(fav => fav.id === item.id);
    const heartIconClass = `${isFavorite ? "fas" : "far"} fa-heart`;
    const Imageheight = { phone: "330px", "smart watch": "240px" }[item.category] || "200px";
    return `
        <div class="product-item col-lg-4 col-md-6 mb-4 p-4 ">
                <div class="card border border-info pt-3 h-100">
                    <img class="product-item-img card-img-top m-auto w-75" src="${item.imageURL}" alt="Card image" style="height:${Imageheight};">
                    <div class="product-itm-desc card-body pb-0 ps-4">
                        <p class="card-title">Product: ${item.title}.</p>
                        <p class="card-text">Category :${item.category}.</p>
                        <p class="color">Color: ${item.color}.</p>
                        <p class="card-price">Price: <span> <del>${item.price} EGP</del> ${item.salePrice} EGP</span></p>
                    </div>
                    <div class="product-item-action d-flex justify-content-between px-4">
                        <button id="remove-btn-${item.id}" class="RemoveFromCartBtn btn btn-primary font-sm fw-semibold mb-2"  ${inCart ? "" : 'style="display:none"'} data-id="${item.id}">Remove From Cart</button> 
                        <button id="add-btn-${item.id}" class="AddToCartBtn btn btn-primary font-sm fw-semibold mb-2" ${inCart ? 'style="display:none"' : ""} data-id="${item.id}">Add To Cart</button>
                        <i id="fav-${item.id}" class="${heartIconClass} fs-2" data-id="${item.id}" ></i>
                    </div>
                </div>
            </div>
            
        `;
       
}
// ------------------- Events -------------------
function attachProductEvents(){
    document.querySelectorAll(".AddToCartBtn").forEach(btn => btn.addEventListener("click", () => addToCart(+btn.dataset.id)));   
    document.querySelectorAll(".RemoveFromCartBtn").forEach(btn=>btn.addEventListener("click",()=>removeFromCart(+btn.dataset.id)));
    document.querySelectorAll(".fa-heart").forEach(btn=>btn.addEventListener("click",()=>checkFavorites(+btn.dataset.id)));
}

// ------------------- Cart Logic -------------------
function addToCart(ProductId){
    if (getUserName) {
        let exiting = cart.find(item => item.id === ProductId);  
        const item = productsList.find(Product => ProductId === Product.id);
        if(!exiting){
            cart.push({ ...item, quantity: 1 });
            total += +item.salePrice;
            saveCart();
            updateUI(ProductId,true)
            drawCartItem(item);
            return;
        }
        else{
            alert ("this proudect already in cart");
        }
    }
    else{
        window.location = "login.html"
    }
    
    
}
function removeFromCart(id){
    const item = cart.find(p => p.id === id);
    const index = cart.indexOf(item);
    if (item) {
        total = total - +(+item.salePrice * +item.quantity);
        cart.splice(index, 1);
        saveCart();
        updateUI(id, false);
        document.getElementById(`cart-${id}`)?.remove();
    }
}
function updateUI(id,inCart){
    let removeBtn = document.getElementById(`remove-btn-${id}`);
    let addBtn = document.getElementById(`add-btn-${id}`);
    removeBtn.style.display = inCart ? "inline-block" : "none";
    addBtn.style.display = inCart ? "none" : "inline-block";
    totalPrice.textContent= total +" EGP";
    badge.style.display = "inline-block";
    badge.textContent = cart.length;
}

function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("totalPrice", total);
}
// ------------------- Cart UI -------------------
function drawCartItem(item){
    item.quantity = cart.find(Product => item.id === Product.id).quantity;
    if (document.getElementById(`cart-${item.id}`)) return;
    const div = document.createElement("div");
    div.className = "row my-1 pe-2 bg-white py-2 rounded-3 text-primary";
    div.id = `cart-${item.id}`;
    div.innerHTML = `
        <span class="col-6">${item.title}</span>
        <span class="col-2" id="qty-${item.id}">${item.quantity}</span>
        <span class="col-2 text-danger" role="button" onclick="changeQty(${item.id},-1)">-</span>
        <span class="col-2 text-success" role="button" onclick="changeQty(${item.id},1)">+</span>
    `;
    buyProduct.appendChild(div);
}

function changeQty(id,change){
    const item = cart.find(p => p.id === id);
    if(!item) return;
    
    if (item.quantity+change <= 0) {
        return removeFromCart(id);
    }
    else{
        item.quantity += change;
        total += change * item.salePrice;
        saveCart();
        document.getElementById(`qty-${id}`).textContent = item.quantity;
        totalPrice.textContent= total +" EGP";
    }
    
}
function restoreCartUI(){
    cart.forEach(item => {
        updateUI(item.id, true);
        drawCartItem(item);
    });
    totalPrice.textContent= total +" EGP";
    badge.style.display = cart.length ? "static" : "none";
    badge.textContent = cart.length;
}

// ------------------- Fav Logic -------------------
function addToFavorites(id){
    if(getUserName){
    const item = productsList.find(prouduct => prouduct.id === id);
    let fav = document.getElementById(`fav-${id}`);
    favs.push(item);
    savefavs();
    fav.classList.replace("far","fas"); 
    }
    else{
       window.location = "login.html"  
    } 
}

function checkFavorites(id){
    const isFav = favs.find(prouduct => prouduct.id === id);
    if(isFav){
        removeFromFavorites(id);
    }
    else{
        addToFavorites(id); 
    }
}
function removeFromFavorites(id){
    let fav = document.getElementById(`fav-${id}`);
    const index = favs.findIndex(prouduct => prouduct.id === id);

    if (index !== -1) {
        favs.splice(index, 1);
        fav.classList.replace("fas","far");
        savefavs();
    }
    else{
        alert("this proudect not in favorites");
    } 
}
function savefavs(){
    localStorage.setItem("favs", JSON.stringify(favs));
}

// ------------------- Search Logic -------------------

searchOption.addEventListener('change', () => {   
    searchMode =  searchOption.value === "searchTittle" ? "title" : "category";
    searchInput.placeholder = "Search By "+searchMode;
    searchInput.value = "";
    renderProducts(productsList);
});

searchInput.addEventListener('input', () =>{
    const value = search.value.toLowerCase();   
    const filtered = productsList.filter(p => p[searchMode].toLowerCase().includes(value));
    renderProducts(filtered);
});