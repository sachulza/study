/** 코드박스 복사 script */

const codeBoxCopy = {
  init() {
    const accordionButtons = document.querySelectorAll(
      ".cbox-accordion .accordion-button"
    );

    accordionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.toggle("active");
        const content = button.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    });

    const copyButtons = document.querySelectorAll(".copy-button");

    copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const code = button.parentElement.querySelector("code");
        const text = code.textContent;
        navigator.clipboard
          .writeText(text)
          .then(() => {
            alert("코드가 복사되었습니다!");
          })
          .catch((err) => {
            console.error("복사에 실패했습니다.", err);
          });
      });
    });

    const codeElements = document.querySelectorAll(".code-box pre code");

    codeElements.forEach((codeElement) => {
      let code = codeElement.textContent;
      if (!code.startsWith(" ")) {
        code = code.replace(/^/gm, " "); // 각 줄 시작 부분에 공백 추가
        codeElement.textContent = code;
      }
    });

    hljs.highlightAll();
  },
};

codeBoxCopy.init();
