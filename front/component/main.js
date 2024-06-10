function toggle() {
  var navMenu = document.querySelector(".nav_menu");

  // navMenu가 보이는지 여부를 확인하고 토글합니다.
  if (navMenu.style.display === "block") {
    navMenu.style.display = "none";
  } else {
    navMenu.style.display = "block";
  }
}


var lastScrollTop = 0;

$(window).scroll(function() {
    var _scrollTop = $(this).scrollTop(); // current scroll position
    var _navHeight = $("#nav").height(); // height of the nav
    var _mainSearch = $(".main_search"); // main search element

    if (_scrollTop >= _navHeight) {
        if (_scrollTop > lastScrollTop) {
            $("#nav").addClass("off");
            _mainSearch.removeClass("fixed");
        } else {
            $("#nav").removeClass("off");
            _mainSearch.addClass("fixed");
        }
        lastScrollTop = _scrollTop;
    } else {
        $("#nav").removeClass("off");
        _mainSearch.removeClass("fixed");
    }
  })

  function zoomIn(event) {
    event.target.style.transform = "scale(1.2)";
    event.target.style.zIndex = 1;
    event.target.style.transition = "all 0.5s";
  }


