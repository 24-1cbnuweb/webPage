var mainfcontainer = document.getElementById("frozenContainer");
var mainFpath = "http://127.0.0.1:8000/media/frozen.json";
var itemsPerPage = 4;
var currentFPage = 1;

// Clear Cart 함수
function clearCart() {
  // 카트 리스트 초기화
  cartList = [];

  // 카트 UI의 아이템 요소들을 모두 삭제합니다.
  const cartDiv = document.getElementById("cart");
  cartDiv.innerHTML = `<div style="height: 40px;"><img src="css/heart.png" style="height: 40px;"></div>
  <!-- 초기화 버튼 -->
  <button class="priceselect" onclick="clearCart()" style="text-decoration: underline; transform: translateY(-15px);">Clear Cart</button>`; // 카트 내용을 비웁니다.
}

// 카트에 아이템을 추가하는 함수
function addFToCart(item) {
  cartList.push(item);
  const cartItem = document.createElement("div");
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
}

// 카트에서 아이템을 제거하는 함수
function removeFromCart(button) {
  const itemToRemove = button.parentNode;
  const index = Array.from(document.getElementById("cart").children).indexOf(itemToRemove);
  cartList.splice(index - 1, 1); // Adjust for the initial div element

  itemToRemove.parentNode.removeChild(itemToRemove);
}

function showFrozen(data) {
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
    mainfcontainer.appendChild(div);
  }
}


function loadFJSON(callback) {
  $.getJSON(mainFpath, function (data) {
    console.log("Data loaded:", data); // Debug log
    callback(data);
  }).fail(function() {
    console.error("Error loading JSON file"); // Error handling
  });
}

// 이전 페이지 버튼 생성
var prevFButton = document.createElement("button");
var prevFimg = document.createElement("img");
prevFButton.className = "btn";
prevFimg.src = "css/left.png";
prevFimg.className = "prevbtn";
prevFimg.style.width = "60px";
prevFButton.appendChild(prevFimg);
prevFButton.onclick = prevFPage; // prevPage 함수를 클릭 이벤트 핸들러로 등록

// 다음 페이지 버튼 생성
var nextFButton = document.createElement("button");
var nextFimg = document.createElement("img");
nextFButton.className = "btn";
nextFimg.src = "css/right.png";
nextFimg.className = "nextbtn";
nextFimg.style.width = "60px";
nextFButton.appendChild(nextFimg);
nextFButton.onclick = nextFPage; // nextPage 함수를 클릭 이벤트 핸들러로 등록

// 버튼을 컨테이너 앞뒤에 추가
mainfcontainer.parentNode.insertBefore(prevFButton, mainfcontainer);
mainfcontainer.parentNode.insertBefore(nextFButton, mainfcontainer.nextSibling);

function prevFPage() {
  if (currentFPage > 1) {
    currentFPage--;
    loadFJSON(showFrozen);
  }
}

function nextFPage() {
  currentFPage++;
  loadFJSON(showFrozen);
}

// 초기 로드
loadFJSON(showFrozen);
