let lastScrollY = window.scrollY;
let delta = 0;
const header = document.querySelector(".layout-header-gnb-wrap");
let timeout;

function calculateHeaderHeight() {
  return header.offsetHeight;
}

window.addEventListener("resize", () => {
  headerHeight = calculateHeaderHeight();
});

let headerHeight = calculateHeaderHeight();

window.addEventListener("scroll", () => {
  if (!timeout) {
    timeout = setTimeout(() => {
      delta = window.scrollY - lastScrollY;

      if (window.scrollY > lastScrollY && delta > 100) {
        header.style.top = `-${headerHeight}px`;
      } else if (window.scrollY < lastScrollY) {
        header.style.top = "0";
      }

      lastScrollY = window.scrollY;
      timeout = null;
    }, 100); // 100ms 간격으로 이벤트 발생
  }
});
