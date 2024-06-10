var maindcontainer = document.getElementById("domesticContainer");
var mainDpath = "http://127.0.0.1:8000/media/domestic.json";
let cartList = [];
var itemsPerPage = 4;
var currentDPage = 1;

// Clear Cart 함수
function clearCart() {
  cartList = [];
  const cartDiv = document.getElementById("cart");
  cartDiv.innerHTML = `
    <div style="height: 30px;"><img src="css/heart.gif" style="height: 30px;"></div>
    <button class="priceselect" onclick="clearCart()" style="text-decoration: underline;">Clear Cart</button>`;
}

// 카트에 아이템을 추가하는 함수
function addToCart(item) {
  if (!item) {
    console.error("Invalid item passed to addToCart");
    return;
  }

  console.log(`Adding to cart: `, item);

  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  cartItem.innerHTML = `
    <div style=" margin-left: 5px; border-radius: 3%;">
      <img src="${item.img}" style="width:150px; height:160px; border-radius: 3%;" alt="${item.name}">
      <h4 style="margin: 5px;">${item.name}</h4>
      <a style="font-weight: 600; color:red;">${item.price}</a>
      <a>(${item.perprice}/100g)</a>
    </div>
    <button class="priceselect" onclick="removeFromCart(this)" style="text-decoration: underline;">Remove</button>
  `;
  document.getElementById("cart").appendChild(cartItem);
  cartList.push(item);
  console.log(`Item added to cart: ${item.name}`);
}

// 카트에서 아이템을 제거하는 함수
function removeFromCart(button) {
  const itemToRemove = button.parentNode;
  const index = Array.from(document.getElementById("cart").children).indexOf(itemToRemove) - 1;
  cartList.splice(index, 1);
  itemToRemove.parentNode.removeChild(itemToRemove);
}

function showDomestic(data) {
  if (!maindcontainer) {
    console.error("maindcontainer element not found");
    return;
  }

  var startDIndex = (currentDPage - 1) * itemsPerPage;
  var endDIndex = Math.min(startDIndex + itemsPerPage, data.length);
  maindcontainer.innerHTML = "";

  for (var i = startDIndex; i < endDIndex; i++) {
    const item = data[i];  // Use a local variable to store the current item
    var div = document.createElement("div");
    div.className = "item";
    const itemName = item.name.length > 30 ? item.name.substring(0, 30) + "..." : item.name;
    var contentDiv = document.createElement("div");
    contentDiv.className = "item-content";
    contentDiv.innerHTML = `
      <img src="${item.img}" class="img">
      <h3>${itemName}</h3>
      <a><del>${item.preprice}</del></a>
      <p style="color:orange; display:inline">${item.discount}</p> 
      <p class="price">${item.price}</p>
      <a>(${item.perprice}/100g)</a>
    `;

    const linkDiv = document.createElement("div");
    linkDiv.className = "link-div";

    const linkButton = document.createElement("button");
    linkButton.className = "link-button";

    const linkImg = document.createElement("img");
    linkImg.src = "./css/link.png";
    linkImg.alt = "link";
    linkImg.className = "link-img";

    linkButton.appendChild(linkImg);
    linkButton.onclick = () => {
      window.open(item.url, "_blank");
    };

    linkDiv.appendChild(linkButton);

    const cartDiv = document.createElement("div");
    cartDiv.className = "cart-div";

    const cartButton = document.createElement("button");
    cartButton.className = "cart-button";

    const cartImg = document.createElement("img");
    cartImg.src = "css/blackheart.png";
    cartImg.alt = "cart";
    cartImg.className = "cart-img";

    cartButton.appendChild(cartImg);
    cartButton.onclick = () => {
      addToCart(item);
    };

    cartDiv.appendChild(cartButton);

    div.appendChild(contentDiv);
    div.appendChild(linkDiv);
    div.appendChild(cartDiv);
    maindcontainer.appendChild(div);
  }
}


function loadDJSON(callback) {
  $.getJSON(mainDpath, function (data) {
    callback(data);
  });
}

// 페이지 버튼 생성 및 추가
function setupPageButtons() {
  const prevDButton = document.createElement("button");
  const prevDimg = document.createElement("img");
  prevDButton.className = "btn";
  prevDimg.src = "css/left.png";
  prevDimg.className = "prevbtn";
  prevDimg.style.width = "60px";
  prevDButton.appendChild(prevDimg);
  prevDButton.onclick = prevDPage;

  const nextDButton = document.createElement("button");
  const nextDimg = document.createElement("img");
  nextDButton.className = "btn";
  nextDimg.src = "css/right.png";
  nextDimg.className = "nextbtn";
  nextDimg.style.width = "60px";
  nextDButton.appendChild(nextDimg);
  nextDButton.onclick = nextDPage;

  maindcontainer.parentNode.insertBefore(prevDButton, maindcontainer);
  maindcontainer.parentNode.insertBefore(nextDButton, maindcontainer.nextSibling);
}

function prevDPage() {
  if (currentDPage > 1) {
    currentDPage--;
    loadDJSON(showDomestic);
  }
}

function nextDPage() {
  currentDPage++;
  loadDJSON(showDomestic);
}

// 초기 로드 및 페이지 버튼 설정
document.addEventListener("DOMContentLoaded", function() {
  setupPageButtons();
  loadDJSON(showDomestic);
});
