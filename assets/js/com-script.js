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

/** feedback panel */
document.addEventListener("DOMContentLoaded", function () {
  const positiveRadio = document.getElementById("radio-feedback-positive");
  const negativeRadio = document.getElementById("radio-feedback-negative");
  const positiveContents = document.querySelector(
    ".feedback-contents-wrap.positive"
  );
  const negativeContents = document.querySelector(
    ".feedback-contents-wrap.negative"
  );
  const submitMessage = document.querySelector(".submit-message-wrap");
  const submitBtns = document.querySelectorAll(".btn-submit-feedback"); // 모든 버튼 선택

  positiveRadio.addEventListener("change", function () {
    positiveContents.classList.add("active");
    negativeContents.classList.remove("active");
    submitMessage.classList.remove("active");
  });

  negativeRadio.addEventListener("change", function () {
    negativeContents.classList.add("active");
    positiveContents.classList.remove("active");
    submitMessage.classList.remove("active");
  });

  submitBtns.forEach(function (btn) {
    // 각 버튼에 이벤트 리스너 추가
    btn.addEventListener("click", function () {
      submitMessage.classList.add("active");
    });
  });
});
