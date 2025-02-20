"use strict";

// 윈도우 사이즈 체크
const windowSize = {
  winSize: null,
  breakPoint: 1024,

  setWinSize() {
    this.winSize = window.innerWidth >= this.breakPoint ? "pc" : "mob";
  },

  getWinSize() {
    return this.winSize;
  },
};

/*** * krds_mainMenuPC * ***/
const krds_mainMenuPC = {
  init() {
    const gnbMenu = document.querySelector(
      ".gnb-desktop-wrap:not(.sample) .gnb-menu"
    );

    if (!gnbMenu) return;

    // gnb 속성설정
    gnbMenu.setAttribute("aria-label", "메인 메뉴");

    // dimed 요소를 설정, 기존 dimed가 없을 경우 생성
    this.backdrop =
      document.querySelector(".gnb-backdrop") || this.createBackdrop();

    // 주 메뉴 및 서브 메뉴의 트리거를 설정하고, 각 트리거에 이벤트를 연결
    const mainTriggers = gnbMenu.querySelectorAll(".gnb-main-trigger");
    const subTriggers = gnbMenu.querySelectorAll(
      ".gnb-sub-trigger:not(.is-link)"
    );
    mainTriggers.forEach((mainTrigger) => this.setupMainTrigger(mainTrigger));
    this.attachEvents(mainTriggers, subTriggers);
    this.setupKeyboardNavigation(mainTriggers);
  },
  setupMainTrigger(mainTrigger) {
    const toggleWrap = mainTrigger.nextElementSibling;
    if (toggleWrap) {
      const uniqueIdx = `gnb-main-menu-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      mainTrigger.setAttribute("aria-controls", uniqueIdx);
      mainTrigger.setAttribute("aria-expanded", "false");
      mainTrigger.setAttribute("aria-haspopup", "true");
      toggleWrap.setAttribute("id", uniqueIdx);

      // 하위 메뉴 설정
      const mainList = toggleWrap.querySelector(".gnb-main-list");
      if (mainList?.getAttribute("data-has-submenu") === "true") {
        const subTriggers = mainList.querySelectorAll(".gnb-sub-trigger");
        subTriggers.forEach((subTrigger) => this.setupSubTrigger(subTrigger));
        if (
          subTriggers.length > 0 &&
          !subTriggers[0].classList.contains("is-link")
        ) {
          subTriggers[0].classList.add("active");
          subTriggers[0].setAttribute("aria-expanded", "true");
          subTriggers[0].nextElementSibling?.classList.add("active");
        }
      }
    }
  },
  setupSubTrigger(subTrigger) {
    const hasMenu = subTrigger.nextElementSibling;
    if (hasMenu) {
      const uniqueIdx = `gnb-sub-menu-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      subTrigger.setAttribute("aria-controls", uniqueIdx);
      subTrigger.setAttribute("aria-expanded", "false");
      subTrigger.setAttribute("aria-haspopup", "true");
      hasMenu.setAttribute("id", uniqueIdx);
    }
  },
  toggleMainMenu(mainTrigger) {
    const isActive = mainTrigger.classList.contains("active");
    const isDropDown = mainTrigger.classList.contains("is-dropdown");
    if (!isActive && mainTrigger.nextElementSibling) {
      this.resetMainMenu();
      mainTrigger.setAttribute("aria-expanded", "true");
      mainTrigger.classList.add("active");
      mainTrigger.nextElementSibling.classList.add("is-open");
      if (!isDropDown) {
        this.toggleBackdrop(true);
        this.toggleScrollbar(true);
        this.adjustSubMenuHeight(
          mainTrigger.nextElementSibling.querySelector(".gnb-main-list")
        );
      }
    } else {
      this.closeMainMenu();
    }
  },
  toggleSubMenu(subTrigger) {
    const otherSubTriggers = subTrigger
      .closest("ul")
      .querySelectorAll(".gnb-sub-trigger:not(.is-link)");
    otherSubTriggers.forEach((trigger) => {
      trigger.classList.remove("active");
      trigger.setAttribute("aria-expanded", "false");
      trigger.nextElementSibling?.classList.remove("active");
    });
    subTrigger.classList.add("active");
    subTrigger.setAttribute("aria-expanded", "true");
    subTrigger.nextElementSibling?.classList.add("active");
    this.adjustSubMenuHeight(subTrigger.closest(".gnb-main-list"));
  },

  toggleBackdrop(isOpen) {
    this.backdrop?.classList.toggle("active", isOpen);
    document.body.classList.toggle("is-gnb-web", isOpen);
    // this.backdrop.style.display = isOpen ? "block" : "none";
  },
  adjustSubMenuHeight(target) {
    // 서브 메뉴 높이를 활성 메뉴에 맞춰 조정
    const activeSubList = target.querySelector(".gnb-sub-list.active");
    const height = activeSubList?.scrollHeight || 0;
    target.style.minHeight = `${height}px`;
  },
  toggleScrollbar(isEnabled) {
    const isScrollNeeded = document.body.scrollHeight > window.innerHeight;
    document.body.classList.toggle("hasScrollY", isEnabled && isScrollNeeded);
  },
  resetMainMenu() {
    document
      .querySelectorAll(
        ".gnb-desktop-wrap:not(.sample) .gnb-main-trigger:not(.is-link)"
      )
      .forEach((mainTrigger) => {
        mainTrigger.classList.remove("active");
        mainTrigger.setAttribute("aria-expanded", "false");
      });
    document
      .querySelectorAll(".gnb-desktop-wrap:not(.sample) .gnb-toggle-wrap")
      .forEach((toggleWrap) => {
        toggleWrap.classList.remove("is-open");
      });
  },
  closeMainMenu() {
    this.resetMainMenu();
    this.toggleBackdrop(false);
    this.toggleScrollbar(false);
  },
  attachEvents(mainTriggers, subTriggers) {
    // gnb-desktop-wrap 외부 클릭시 닫기
    document.addEventListener("click", ({ target }) => {
      if (!target.closest(".gnb-desktop-wrap")) this.closeMainMenu();
    });

    // 백드롭 클릭 시 메뉴 닫기
    // this.backdrop.addEventListener("click", () => this.closeMainMenu());

    // ESC 키를 눌러 메뉴를 닫거나, TAB 키로 초점이 메뉴 외부로 이동했을 때 메뉴 닫기
    document.addEventListener("keyup", (event) => {
      if (
        event.code === "Escape" ||
        !event.target.closest(".gnb-desktop-wrap")
      ) {
        this.closeMainMenu();
      }
    });

    // 메인 메뉴 트리거 설정
    mainTriggers.forEach((mainTrigger) => {
      mainTrigger.addEventListener("click", () =>
        this.toggleMainMenu(mainTrigger)
      );
    });

    // 서브 메뉴 트리거 설정
    subTriggers.forEach((subTrigger) => {
      subTrigger.addEventListener("click", () =>
        this.toggleSubMenu(subTrigger)
      );
    });
  },
  setupKeyboardNavigation(mainTriggers) {
    const focusMenuItem = (element) => {
      if (element) {
        element.focus();
      }
    };
    const findFocusableElement = (element, direction) => {
      const sibling =
        direction === "next" ? "nextElementSibling" : "previousElementSibling";
      const parent = element.closest("li")?.[sibling];
      return parent ? parent.querySelector("[data-trigger]") : null;
    };
    // Home, End, 방향키를 통해 메뉴 항목 간의 이동을 처리
    document.addEventListener("keydown", (event) => {
      const target = event.target;
      if (target.getAttribute("data-trigger")) {
        switch (event.key) {
          case "Home":
            event.preventDefault();
            focusMenuItem(mainTriggers[0]);
            break;
          case "End":
            event.preventDefault();
            focusMenuItem(mainTriggers[mainTriggers.length - 1]);
            break;
          case "ArrowRight":
          case "ArrowDown":
            event.preventDefault();
            const nextElement = findFocusableElement(target, "next");
            focusMenuItem(nextElement);
            break;
          case "ArrowLeft":
          case "ArrowUp":
            event.preventDefault();
            const previousElement = findFocusableElement(target, "prev");
            focusMenuItem(previousElement);
            break;
          default:
            break;
        }
      }
    });
  },
};

/* news tab 제작 */
function newsTab(wrapperSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) return;

  wrapper.querySelectorAll("button[id^='news-tab']").forEach((tab) => {
    tab.addEventListener("click", function () {
      let index = this.id.replace("news-tab", ""); // 'news-tab ##'에서 숫자만 추출

      // 모든 .news-list와 .news-tab-container 요소에서 'active' 클래스 제거
      wrapper.querySelectorAll(".news-list").forEach((element) => {
        element.classList.remove("active");
      });
      wrapper.querySelectorAll(".news-tab-container").forEach((container) => {
        container.classList.remove("active");
      });

      // 클릭한 탭에 해당하는 .news-list 요소에 'active' 클래스 추가
      let targetNews = wrapper.querySelectorAll(".news-list")[index - 1];
      let targetContainer = wrapper.querySelectorAll(".news-tab-container")[
        index - 1
      ];

      if (targetNews) {
        targetNews.classList.add("active");
      }
      if (targetContainer) {
        targetContainer.classList.add("active");
      }
    });
  });
}

/*** 드롭박스 ***/
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".globe, .support, .nav-mypage");
  const dropBoxes = document.querySelectorAll(".drop-box");

  document.addEventListener("click", function (event) {
    let isInsideDropdown = false;

    buttons.forEach((button) => {
      const parentBox = button.closest(".util-btn-box, .nav-btn-box");
      const dropdown = parentBox ? parentBox.querySelector(".drop-box") : null;

      if (dropdown && button.contains(event.target)) {
        // 현재 클릭한 버튼의 드롭다운을 열거나 닫기
        const isActive = dropdown.classList.contains("active");
        closeAllDropdowns(); // 다른 드롭다운은 닫기
        if (!isActive) {
          dropdown.classList.add("active"); // 현재 버튼의 드롭다운만 열기
        }
        isInsideDropdown = true;
      }
    });

    dropBoxes.forEach((dropBox) => {
      if (dropBox.contains(event.target)) {
        dropBox.classList.add("active");
        isInsideDropdown = true;
      }
    });

    // 드롭박스 내부의 a 태그 클릭 시 active 클래스 추가
    if (event.target.matches(".drop-box li a")) {
      const clickedLink = event.target;
      const parentDropBox = clickedLink.closest(".drop-box");

      // 같은 drop-box 내부의 다른 a 태그에서 active 제거
      parentDropBox.querySelectorAll("a").forEach((link) => {
        link.classList.remove("active");
      });

      // 클릭한 a 태그에 active 추가
      clickedLink.classList.add("active");
      isInsideDropdown = true;
    }

    // 드롭다운 내부의 특정 버튼 클릭 시 닫히지 않도록 예외 처리
    if (event.target.closest(".time-extend-btn, .drop-logout")) {
      isInsideDropdown = true;
    }

    if (!isInsideDropdown) {
      closeAllDropdowns();
    }
  });

  // ESC 키를 누르면 drop-box 닫기
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });

  function closeAllDropdowns() {
    document.querySelectorAll(".drop-box").forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  }
});

/*** 모바일 - 메인메뉴 ***/
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".nav-menu");
  const backdrop = document.querySelector(".gnb-backdrop-mobile");
  const mobileMenu = document.querySelector(".menu-mobile-wrap");
  const body = document.body;

  if (!menuButton || !backdrop || !mobileMenu) return;

  // 전체메뉴 버튼 클릭 시
  menuButton.addEventListener("click", function () {
    backdrop.classList.add("active");
    mobileMenu.classList.add("is-open");
    body.classList.add("is-gnb-mobile");
  });

  // 닫기 버튼 클릭 시 원래 상태로 복구
  document.addEventListener("click", function (event) {
    if (event.target.closest(".modal-close.mobile-main-menu")) {
      backdrop.classList.remove("active");
      mobileMenu.classList.remove("is-open");
      body.classList.remove("is-gnb-mobile");
    }
  });

  // 3Depth 서브메뉴 클릭 시 (보조금24란 클릭)
  document.addEventListener("click", function (event) {
    const submenuTrigger = event.target.closest(".submenu-trigger.has-depth3");
    if (submenuTrigger) {
      event.preventDefault(); // a 태그 기본 동작 방지
      const depth3Wrap = document.querySelector(".mobile-depth3-wrap");
      if (depth3Wrap) {
        // is-open 클래스를 토글
        depth3Wrap.classList.toggle("is-open");
      }
    }
  });

  // 4Depth 서브메뉴 추가
  document.addEventListener("click", function (event) {
    const depth4Trigger = event.target.closest(".depth3-trigger.has-depth4");
    if (depth4Trigger) {
      event.preventDefault(); // a 태그 기본 동작 방지
      const depth4Wrap = depth4Trigger.nextElementSibling;
      if (depth4Wrap && depth4Wrap.classList.contains("depth4-wrap")) {
        depth4Wrap.classList.add("is-open");
      }
    }
  });

  // 4Depth 서브메뉴 제거 (btn-prev 버튼 클릭 시)
  const btnPrev = document.querySelector(".btn-prev");
  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      const depth4Wrap = document.querySelector(".depth4-wrap.is-open");
      if (depth4Wrap) {
        depth4Wrap.classList.remove("is-open"); // 'is-open' 클래스 제거
      }
    });
  }

  // depth4-header 내의 modal-close 버튼 클릭 시, 4Depth 서브메뉴 제거
  const modalClose = document.querySelector(
    ".depth4-header .modal-close.mobile-main-menu"
  );
  if (modalClose) {
    modalClose.addEventListener("click", function () {
      const depth4Wrap = document.querySelector(".depth4-wrap.is-open");
      if (depth4Wrap) {
        depth4Wrap.classList.remove("is-open"); // 'is-open' 클래스 제거
      }
    });
  }

  // mobileMenu에서 is-open 클래스 제거 시 모든 상태 초기화
  mobileMenu.addEventListener("transitionend", function () {
    if (!mobileMenu.classList.contains("is-open")) {
      // 모든 서브메뉴 초기화
      const depth3Wrap = document.querySelector(".mobile-depth3-wrap");
      if (depth3Wrap) {
        depth3Wrap.classList.remove("is-open");
      }

      const depth4Wrap = document.querySelector(".depth4-wrap.is-open");
      if (depth4Wrap) {
        depth4Wrap.classList.remove("is-open");
      }
    }
  });
});

/*** mobile 스크롤 활성화 ***/
$(".page-indicator > ul > li > a").click(function (e) {
  var href = $(this).attr("href");

  var targetTop = $(href).offset().top;

  /*
  // 한번에 가도록 하는 방법
  $(window).scrollTop(targetTop);
  */

  $("html").stop().animate({ scrollTop: targetTop }, 300);

  e.preventDefault();
});

function Page__updateIndicatorActive() {
  var scrollTop = $(window).scrollTop();

  // 역순으로 검색해야 편하다
  $($(".page").get().reverse()).each(function (index, node) {
    var $node = $(this);
    var offsetTop = parseInt($node.attr("data-offset-top"));

    if (scrollTop >= offsetTop) {
      // 기존 녀석에게 활성화 풀고
      $(".page-indicator > ul > li.active").removeClass("active");
      // 해당하는 녀석에게 활성화 넣고

      var currentPageIndex = $node.index();
      $(".page-indicator > ul > li").eq(currentPageIndex).addClass("active");

      $("html").attr("data-current-page-index", currentPageIndex);

      return false; // 더 이상 다른 페이지를 검사하지 않는다.
    }
  });
}

// 각 페이지의 offsetTop 속성을 업데이트
function Page__updateOffsetTop() {
  $(".page").each(function (index, node) {
    var $page = $(node);
    var offsetTop = $page.offset().top;

    $page.attr("data-offset-top", offsetTop);
  });

  // 계산이 바뀌었으니까, 다시 상태 업데이트
  Page__updateIndicatorActive();
}

function Page__init() {
  Page__updateOffsetTop();
}

// 초기화
Page__init();

// 화면이 리사이즈 할 때 마다, offsetTop을 다시계산
$(window).resize(Page__updateOffsetTop);

// 스크롤이 될 때 마다, 인디케이터의 상태를 갱신
$(window).scroll(Page__updateIndicatorActive);

/*** 모달 - 화면 변경 ***/
document.addEventListener("DOMContentLoaded", function () {
  const settingButton = document.querySelector(".layout-header-wrap .setting");
  const modalSection = document.querySelector(".modal-adjust-display");
  const closeButton = document.querySelector(
    ".modal-adjust-display .modal-close"
  );
  const mainContent = document.querySelector(".page-main-wrap");

  // 스크롤 비활성화 함수
  function disableScroll() {
    document.body.style.overflow = "hidden";
  }

  // 스크롤 활성화 함수
  function enableScroll() {
    document.body.style.overflow = "";
  }

  // 모달 열기
  settingButton.addEventListener("click", function () {
    modalSection.classList.add("shown");
    mainContent.setAttribute("inert", ""); // 메인 콘텐츠 비활성화
    disableScroll(); // 스크롤 막기
  });

  // 모달 닫기
  closeButton.addEventListener("click", function () {
    modalSection.classList.remove("shown");
    mainContent.removeAttribute("inert"); // 메인 콘텐츠 활성화
    enableScroll(); // 스크롤 다시 활성화
  });
});

/*** 모달 - 전체 검색 ***/
document.addEventListener("DOMContentLoaded", function () {
  const settingButton = document.querySelector(
    ".layout-header-wrap .nav-search"
  );
  const modalSection = document.querySelector(".modal-search-wrap");
  const closeButton = document.querySelector(".modal-search-wrap .modal-close");
  const mainContent = document.querySelector(".page-main-wrap");

  // 스크롤 비활성화 함수
  function disableScroll() {
    document.body.style.overflow = "hidden";
  }

  // 스크롤 활성화 함수
  function enableScroll() {
    document.body.style.overflow = "";
  }

  // 모달 열기
  settingButton.addEventListener("click", function () {
    modalSection.classList.add("shown");
    mainContent.setAttribute("inert", ""); // 메인 콘텐츠 비활성화
    disableScroll(); // 스크롤 막기
  });

  // 모달 닫기
  closeButton.addEventListener("click", function () {
    modalSection.classList.remove("shown");
    mainContent.removeAttribute("inert"); // 메인 콘텐츠 활성화
    enableScroll(); // 스크롤 다시 활성화
  });
});

// 'main-news-wrap' 내부에서만 작동
newsTab(".main-news-wrap");

krds_mainMenuPC.init();
