/** help panel tab */
const helpPanelTab = {
  init() {
    document.addEventListener("DOMContentLoaded", function () {
      const helpOpenButtons = document.querySelectorAll(".help-open");
      const helpFoldButtons = document.querySelectorAll(".help-fold");
      const helpPanelWraps = document.querySelectorAll(".help-panel-wrap");

      if (helpOpenButtons.length > 0 && helpPanelWraps.length > 0) {
        helpOpenButtons.forEach(function (button) {
          button.addEventListener("click", function () {
            helpPanelWraps.forEach(function (panel) {
              panel.classList.add("is-open");
            });
          });
        });
      }

      if (helpFoldButtons.length > 0 && helpPanelWraps.length > 0) {
        helpFoldButtons.forEach(function (button) {
          button.addEventListener("click", function () {
            helpPanelWraps.forEach(function (panel) {
              panel.classList.remove("is-open");
            });
          });
        });
      }
    });
  },
};

helpPanelTab.init();

/** tool tip */
document.addEventListener("DOMContentLoaded", function () {
  const tooltipWraps = document.querySelectorAll(".com-tooltip-wrap");

  tooltipWraps.forEach((currentTooltipWrap) => {
    const openButton = currentTooltipWrap.querySelector(".btn-tooltip-open");
    const closeButton = currentTooltipWrap.querySelector(".btn-tooltip-close");
    const popover = currentTooltipWrap.querySelector(".tooltip-popover");

    // 접근성 향상을 위한 속성 설정
    openButton.setAttribute("aria-haspopup", "true");
    openButton.setAttribute("aria-expanded", "false");
    popover.setAttribute("aria-hidden", "true");

    openButton.addEventListener("click", function (event) {
      tooltipWraps.forEach((otherTooltipWrap) => {
        if (otherTooltipWrap !== currentTooltipWrap) {
          const otherPopover =
            otherTooltipWrap.querySelector(".tooltip-popover");
          otherPopover.classList.remove("active");
          otherTooltipWrap
            .querySelector(".btn-tooltip-open")
            .setAttribute("aria-expanded", "false");
          otherTooltipWrap
            .querySelector(".tooltip-popover")
            .setAttribute("aria-hidden", "true");
        }
      });

      popover.classList.add("active");
      openButton.setAttribute("aria-expanded", "true");
      popover.setAttribute("aria-hidden", "false");
      event.stopPropagation();
    });

    closeButton.addEventListener("click", function () {
      popover.classList.remove("active");
      openButton.setAttribute("aria-expanded", "false");
      popover.setAttribute("aria-hidden", "true");
    });

    document.addEventListener("click", function (event) {
      if (
        popover.classList.contains("active") &&
        !popover.contains(event.target) &&
        event.target !== openButton
      ) {
        popover.classList.remove("active");
        openButton.setAttribute("aria-expanded", "false");
        popover.setAttribute("aria-hidden", "true");
      }
    });

    // 키보드 접근성
    openButton.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openButton.click();
      }
    });

    closeButton.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        closeButton.click();
      }
    });
  });

  // Esc 키 이벤트 핸들러
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      const activePopover = document.querySelector(".tooltip-popover.active");
      if (activePopover) {
        activePopover.classList.remove("active");
        const openButton = activePopover
          .closest(".com-tooltip-wrap")
          .querySelector(".btn-tooltip-open");
        openButton.setAttribute("aria-expanded", "false");
        activePopover.setAttribute("aria-hidden", "true");
      }
    }
  });
});
