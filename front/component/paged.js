// 초기화
const dpcontainer = document.getElementById("DpageContainer");
const Dpath = "http://127.0.0.1:8000/media/domestic.json";
const itemsPerRow = 4;
const totalItems = 100; // 스크롤로 추가되는 아이템
let currentDPage = 1;
const itemsToShow = 40; // 한 번에 보여줄 아이템 수
let dataloaded = false;
let currentSort = ""; // 현재 정렬 상태 저장
let cartList = [];

const loading_page = document.getElementById("load");
loading_page.style.display = "none";

// Clear Cart 함수
function clearCart() {
  // 카트 리스트 초기화
  cartList = [];

  // 카트 UI의 아이템 요소들을 모두 삭제합니다.
  const cartDiv = document.getElementById("cart");
  cartDiv.innerHTML = `<div style="height: 30px;"><img src="css/heart.gif" style="height: 30px;"></div>
  <!-- 초기화 버튼 -->
  <button class="priceselect" onclick="clearCart()" style="text-decoration: underline;">Clear Cart</button>`; // 카트 내용을 비웁니다.
}

// 카트에 아이템을 추가하는 함수
function addToCart(item) {
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
  const index = Array.from(document.getElementById("cart").children).indexOf(
    itemToRemove
  );
  cartList.splice(index - 1, 1); // Adjust for the initial div element

  itemToRemove.parentNode.removeChild(itemToRemove);
}

// 제품 목록을 화면에 표시하는 함수
function showPDomestic(data) {
  const startDIndex = (currentDPage - 1) * totalItems;
  const endDIndex = Math.min(startDIndex + totalItems, data.length);

  let divRow;
  for (
    let i = startDIndex;
    i < Math.min(startDIndex + itemsToShow, endDIndex);
    i++
  ) {
    const itemIndexInRow = (i - startDIndex) % itemsPerRow;

    if (itemIndexInRow === 0) {
      divRow = document.createElement("div");
      divRow.className = "row";
      dpcontainer.appendChild(divRow);
    }

    const divItem = document.createElement("div");
    divItem.className = "item";

    const itemName =
      data[i].name.length > 30
        ? data[i].name.substring(0, 30) + "..."
        : data[i].name;

    const contentDiv = document.createElement("div");
    contentDiv.className = "item-content";
    contentDiv.innerHTML = `
      <img src="${data[i].img}" class="img" alt="${itemName}">
      <h3>${itemName}</h3>
      <a><del>${data[i].preprice}</del></a>
      <p style="color:orange; display:inline">${data[i].discount}</p> 
      <p class="price">${data[i].price}</p>
      <a>(${data[i].perprice}/100g)</a>
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
      window.open(data[i].url, "_blank");
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
      addToCart(data[i]);
    };

    cartDiv.appendChild(cartButton);

    divItem.appendChild(contentDiv);
    divItem.appendChild(linkDiv);
    divItem.appendChild(cartDiv);
    divRow.appendChild(divItem);
  }
}

function loadMoreItems() {
  // 스크롤 이벤트 발생 시 로딩 페이지 이미지 표시
  loading_page.style.display = "block";

  // 다음 페이지로 넘어갈 때마다 currentDPage 값을 증가시킵니다.
  currentDPage += 1;

  const searchInput = document.getElementById("nav").value.toLowerCase(); // Get the search input value
  const hasSearchInput = searchInput.length > 0;

  const callback = (data) => {
    showPDomestic(data);
    loading_page.style.display = "none";
  };

  if (currentSort === "lowprice") {
    loadlowpJSON(callback);
  } else if (currentSort === "highprice") {
    loadhighpJSON(callback);
  } else if (currentSort === "highdc") {
    loadhighdcJSON(callback);
  } else {
    // 정렬 없이 데이터를 로드할 경우
    if (hasSearchInput) {
      loadselectJSON(callback);
    } else {
      loadDpJSON(callback);
    }
  }
}

window.addEventListener("scroll", () => {
  // 스크롤이 맨 아래에 도달하면 loadMoreItems 함수를 호출합니다.
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    loadMoreItems();
  }
});



function loadselectJSON(callback) {
  const searchInput = document.getElementById('nav').value.toLowerCase(); // Get the search input value

  $.getJSON(Dpath, function (data) {
    // Filter the data to only include items where `incategory` matches the search input
    const selecteddata = data.filter(item => item.incategory.toLowerCase() === searchInput);
    callback(selecteddata); // Call the callback with the filtered data
  });
}

function selectshow() {
  if (dataloaded) {
    dataloaded = false;
    loading_page.style.display = 'block'; // 로딩 화면 표시
    dpcontainer.innerHTML = ""; // 이전 데이터 삭제
    setTimeout(function() {
      loadselectJSON(function (data) {
        showPDomestic(data);
        loading_page.style.display = 'none'; // 로딩 화면 숨김
        dataloaded = true;
      });
    }, 500); // 0.5초의 지연 후 데이터 로딩
  }
}


function loadDpJSON(callback) {
  $.getJSON(Dpath, function (data) {
    jsonData = data; // 데이터 저장
    callback(data);
    dataloaded = true;
  });
}

loadDpJSON(function (data) {
  showPDomestic(data);
});

function sortByPriceAscending(data) {
  data.sort(function (a, b) {
    return parseFloat(a.price) - parseFloat(b.price);
  });
  console.log("sortByPriceAscending");
}

function sortByPriceDescending(data) {
  data.sort(function (a, b) {
    return parseFloat(b.price) - parseFloat(a.price);
  });
  console.log("sortByPriceDescending");
}

function sortByDiscountDescending(data) {
  data.sort(function (a, b) {
    var discountA = parseInt(a.discount.replace(/[^0-9]/g, ""), 10);
    var discountB = parseInt(b.discount.replace(/[^0-9]/g, ""), 10);
    return discountB - discountA;
  });
  console.log("sortByDiscountDescending");
}

function loadlowpJSON(callback) {
  const searchInput = document.getElementById("nav").value.toLowerCase(); // Get the search input value

  $.getJSON(Dpath, function (lowpdata) {
    // Filter the data to only include items where `incategory` matches the search input
    if (searchInput) {
      lowpdata = lowpdata.filter(
        (item) => item.incategory.toLowerCase() === searchInput
      );
    }

    // Price를 숫자로 변환하여 오름차순으로 정렬
    lowpdata.sort(function (a, b) {
      var priceA = parseInt(a.price.replace(/[^0-9]/g, ""), 10);
      var priceB = parseInt(b.price.replace(/[^0-9]/g, ""), 10);
      return priceA - priceB;
    });

    lowpdata = lowpdata.filter(function (item) {
      var price = parseInt(item.price.replace(/[^0-9]/g, ""), 10);
      return price < 1000000 && price > 1000;
    });

    callback(lowpdata);
  });
}

function loadhighpJSON(callback) {
  const searchInput = document.getElementById("nav").value.toLowerCase(); // Get the search input value

  $.getJSON(Dpath, function (highpdata) {
    // Filter the data to only include items where `incategory` matches the search input
    if (searchInput) {
      highpdata = highpdata.filter(
        (item) => item.incategory.toLowerCase() === searchInput
      );
    }

    // Price를 숫자로 변환하여 오름차순으로 정렬
    highpdata.sort(function (a, b) {
      var priceA = parseInt(a.price.replace(/[^0-9]/g, ""), 10);
      var priceB = parseInt(b.price.replace(/[^0-9]/g, ""), 10);
      return priceA - priceB;
    });

    highpdata = highpdata.filter(function (item) {
      var price = parseInt(item.price.replace(/[^0-9]/g, ""), 10);
      return price < 1000000 && price > 1000;
    });

    callback(highpdata);
  });
}

function loadhighdcJSON(callback) {
  $.getJSON(Dpath, function (highdcdata) {
    const searchInput = document.getElementById("nav").value.toLowerCase(); // Get the search input value

    if (searchInput) {
      highdcdata = highdcdata.filter(
        (item) => item.incategory.toLowerCase() === searchInput
      );
    }

    // Convert discount to a number and sort in descending order
    highdcdata.sort(function (a, b) {
      var discountA = parseInt(a.discount.replace(/[^0-9]/g, ""), 10);
      var discountB = parseInt(b.discount.replace(/[^0-9]/g, ""), 10);
      return discountB - discountA;
    });
    highdcdata = highdcdata.filter(function (item) {
      var price = parseInt(item.price.replace(/[^0-9]/g, ""), 10);
      return price < 1000000 && price > 1000;
    });
    callback(highdcdata);
  });
}

function show() {
  
  const searchInput = document.getElementById('nav').value.toLowerCase(); // Get the search input value
  searchInput.value="";
  if (dataloaded) {
    dataloaded = false;
    loading_page.style.display = "block"; // 로딩 화면 표시
    dpcontainer.innerHTML = ""; // 이전 데이터 삭제
    currentDPage = 1;
    setTimeout(function () {
      loadDpJSON(function (data) {
        showPDomestic(data);
        loading_page.style.display = "none"; // 로딩 화면 숨김
        dataloaded = true;
      });
    }, 500); // 0.5초의 지연 후 데이터 로딩
  }
}

function lowdata() {
  currentSort = "lowprice"; // 현재 정렬 상태 설정
  if (dataloaded) {
    dataloaded = false;
    loading_page.style.display = "block"; // 로딩 화면 표시
    dpcontainer.innerHTML = ""; // 이전 데이터 삭제
    currentDPage = 1;
    setTimeout(function () {
      loadlowpJSON(function (data) {
        sortByPriceAscending(data);
        showPDomestic(data);
        loading_page.style.display = "none"; // 로딩 화면 숨김
        dataloaded = true;
      });
    }, 500); // 0.5초의 지연 후 데이터 로딩
  }
}

function highdata() {
  currentSort = "highprice"; // 현재 정렬 상태 설정
  if (dataloaded) {
    dataloaded = false;
    loading_page.style.display = "block"; // 로딩 화면 표시
    dpcontainer.innerHTML = ""; // 이전 데이터 삭제
    currentDPage = 1;
    setTimeout(function () {
      loadhighpJSON(function (data) {
        sortByPriceDescending(data);
        showPDomestic(data);
        loading_page.style.display = "none"; // 로딩 화면 숨김
        dataloaded = true;
      });
    }, 500); // 0.5초의 지연 후 데이터 로딩
  }
}

function highdc() {
  currentSort = "highdc"; // 현재 정렬 상태 설정
  if (dataloaded) {
    dataloaded = false;
    loading_page.style.display = "block"; // 로딩 화면 표시
    dpcontainer.innerHTML = ""; // 이전 데이터 삭제
    currentDPage = 1;
    setTimeout(function () {
      loadhighdcJSON(function (data) {
        sortByDiscountDescending(data);
        showPDomestic(data);

        loading_page.style.display = "none"; // 로딩 화면 숨김
        dataloaded = true;
      });
    }, 500); // 0.5초의 지연 후 데이터 로딩
  }
}
