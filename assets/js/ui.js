function MySliderMainVisual() {
  let swiper = new Swiper(".main-visual-swiper .swiper", {
    // Optional parameters
    slidesPerView: 1,
    loop: true,

    // If we need pagination
    pagination: {
      el: ".main-visual-swiper .swiper-pagination",
      clickable: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: ".main-visual-swiper .swiper-button-next",
      prevEl: ".main-visual-swiper .swiper-button-prev",
    },

    autoHeight: true,
  });
}

function MySliderBookmark() {
  let swiper = new Swiper(".main-bookmark-wrap .swiper", {
    slidesPerView: 4,
    // spaceBetween: 80,

    pagination: {
      el: ".main-bookmark-wrap .swiper-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".main-bookmark-wrap .swiper-button-next",
      prevEl: ".main-bookmark-wrap .swiper-button-prev",
    },

    // autoHeight: true,
  });
}

function MySliderContents() {
  let swiper = new Swiper(".main-combi-contents-wrap .swiper", {
    slidesPerView: "auto",
    slidesPerView: 1,
    spaceBetween: 60,

    breakpoints: {
      768: {
        slidesPerView: 1, //브라우저가 768보다 클 때
        spaceBetween: 60,
      },

      1024: {
        slidesPerView: 2, //브라우저가 1024보다 클 때
        spaceBetween: 50,
      },
    },

    pagination: {
      el: ".main-combi-contents-wrap .swiper-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".main-combi-contents-wrap .swiper-button-next",
      prevEl: ".main-combi-contents-wrap .swiper-button-prev",
    },

    // autoHeight: true,
  });
}

MySliderMainVisual();
MySliderBookmark();
MySliderContents();
