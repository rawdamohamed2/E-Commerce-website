let proudectsInCart = localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")) : [];
const CproductsContainer = document.getElementById("productsContainer");
const allfavorites = document.querySelector(".favorites");
let totalPrice = localStorage.getItem("totalPrice") ? +(localStorage.getItem("totalPrice")) : 0;
const totalPriceElement = document.getElementById("TotalPrice");
let favorites = JSON.parse(localStorage.getItem('favs')) || [];
let carouselInner = document.getElementById("favoritesCarousel");
const totalPriceEle = document.getElementById("total");
const badge = document.getElementById("badge");
const buyProduct = document.getElementById("buyProduct");

if (proudectsInCart) {
  updateUI();
  renderProductsCart(proudectsInCart);
  drawFavData();
  restoreCartUI();
}
// ------------------- Render Products -------------------
function renderProductsCart(proudectsInCart) {
  if(proudectsInCart.length == 0){
    CproductsContainer.innerHTML = `<h2 class="text-center m-auto py-2">Your cart is empty</h2>`;
    return;
  }
  CproductsContainer.innerHTML = proudectsInCart.map((item) => drawProudectCart(item)).join('');
  attachProductEvents();
}
function drawProudectCart(item) {
  return `
    <div id="product-${item.id}" class="product-item col-md-6 mb-4 px-3">
      <div class="card border border-info">
        <div class="row">
          <div class="col-md-4">
            <img class="product-item-img card-img-top ms-md-3 mt-4" src="${item.imageURL}" alt="${item.title} image">
          </div>
          <div class="col-md-8">
            <div class="product-item-desc card-body pb-0">
              <p class="card-title">Product: ${item.title}.</p>
              <p class="card-text">Category: ${item.category}.</p>
              <p class="color">Color: ${item.color}.</p>
              <p class="card-price">Price: <span><del>${item.price}</del> EGP ${item.salePrice}</span></p>
            </div>
          <div class="product-item-action d-flex justify-content-between align-items-center pe-4 ps-3 gap-2">
            <button id="remove-btn-${item.id}" class="RemoveFromCartBtn btn btn-primary mb-2 fw-semibold font-sm" data-id="${item.id}">Remove From Cart</button>
            <span class="text-danger mins p-0 m-0 fs-2" role="button" onclick="changeQty(${item.id},-1)">-</span>
            <span class="text-success pls p-0 m-0 fs-2" role="button" onclick="changeQty(${item.id},1)">+</span>
            <div class="text-primary fs-4" id="quantity-${item.id}">${item.quantity}</div>
          </div>
        </div>
      </div>
    </div>
  </div>  
    `
}
// ------------------- Events -------------------
function attachProductEvents(){
  document.querySelectorAll(".RemoveFromCartBtn").forEach(btn=>btn.addEventListener("click",()=>removeFromCart(+btn.dataset.id)));  
}
// ------------------- Cart Products Logic -------------------
function removeFromCart(id) {
    const item = proudectsInCart.find(p => p.id === id);
    const index = proudectsInCart.indexOf(item);
    if (item) {
        totalPrice = totalPrice - +(+item.salePrice * +item.quantity);
        proudectsInCart.splice(index, 1);
        saveproductsInCart();
        updateUI();
        document.getElementById(`product-${item.id}`)?.remove();
        document.getElementById(`cart-${id}`)?.remove();
    }
}
function saveproductsInCart(){
  localStorage.setItem("cart", JSON.stringify(proudectsInCart));
  localStorage.setItem("totalPrice", totalPrice);
}
function updateUI(){
    totalPriceElement.textContent= totalPrice +" EGP";
    badge.style.display = "inline-block";
    badge.textContent = proudectsInCart.length;
    totalPriceEle.textContent= totalPrice +" EGP"; 
}
function changeQty(id,change){
    const item = proudectsInCart.find(p => p.id === id);
    if(!item) return;
    
    if (item.quantity + change <= 0) {
        return removeFromCart(id);
    }
    else{
        item.quantity += change;
        totalPrice += change * item.salePrice;
        saveproductsInCart();
        document.getElementById(`quantity-${id}`).textContent = item.quantity;
        updateUI();
        document.getElementById(`qty-${id}`).textContent = item.quantity;  
    }
    
}

// ------------------- Fav Logic -------------------
function drawFavData() {
  let html = '';
  const chunkSize = 3;
  const total = favorites.length;
  carouselInner.innerHTML = '';
  if (total === 0) {
    carouselInner.innerHTML = '<h2 class="text-center m-auto py-2"> Your favorites is empty </h2>';
    return;
  }

  for (let i = 0; i < total; i += chunkSize) {
    const chunk = favorites.slice(i, i + chunkSize);

    let itemsHTML = chunk.map((item) => {
      return `
        <div id="favProduct-${item.id}" class="col-12 col-sm-6 col-lg-4">
          <div class="card border border-info p-3">
            <img class="product-item-img card-img-top m-auto" src="${item.imageURL}" alt="${item.title} image" width="250px" height="250px">
            <div class="row">
              <div class="product-itm-desc card-body pb-2 ps-4 col-9">
                <p class="card-title">Product: ${item.title}</p>
                <p class="card-text">Category: ${item.category}</p>
              </div>
              <div class="product-item-action d-flex justify-content-center mt-4 mb-2 pt-4 col-3">
                <i id="fav-${item.id}" class="fas fa-heart fs-2" role="button" data-id="${item.id}" onclick="removeFromFavorites(${item.id})"></i>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    html += `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <div class="row justify-content-center g-3">
          ${itemsHTML}
        </div>
      </div>
    `;
  }
  html+=`<button class="carousel-control-prev h-25 my-auto" type="button" data-bs-target="#favoritesCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next h-25 my-auto" type="button" data-bs-target="#favoritesCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>`;
  carouselInner.insertAdjacentHTML('beforeend', html);
          
}
function removeFromFavorites(id) {
  const index = favorites.findIndex(prouduct => prouduct.id === id);
  console.log( index);
  if (index !== -1) {
    favorites.splice(index, 1);
    savefavorites();
    drawFavData();
    
  }
  else{
    alert("this proudect not in favorites");
  } 
}
function savefavorites(){
    localStorage.setItem("favs", JSON.stringify(favorites));
}


// ------------------- Cart UI -------------------
function drawCartItem(item){
    item.quantity = proudectsInCart.find(Product => item.id === Product.id).quantity; 
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

function restoreCartUI(){
  proudectsInCart.forEach(item => {
      drawCartItem(item);
  });
  totalPriceEle.textContent= totalPrice +" EGP";
  badge.style.display = proudectsInCart.length ? "static" : "none";
  badge.textContent = proudectsInCart.length;
  totalPriceElement.textContent= totalPrice +" EGP";
}