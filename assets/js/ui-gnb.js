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
  const buttons = document.querySelectorAll(".globe, .support");
  const dropBoxes = document.querySelectorAll(".drop-box");

  document.addEventListener("click", function (event) {
    let isInsideDropdown = false;

    buttons.forEach((button) => {
      const dropdown = button.querySelector(".drop-box");

      if (button.contains(event.target)) {
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

/*** 모달 - 화면 변경 ***/
document.addEventListener("DOMContentLoaded", function () {
  const settingButton = document.querySelector(".layout-header-wrap .setting");
  const modalSection = document.querySelector(".modal-adjust-display");
  const closeButton = document.querySelector(".modal-close");
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
