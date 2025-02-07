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
    observer: true,
    observeParents: true,
  });
}

function MySliderBookmark() {
  let ww = window.innerWidth;
  let swiper = new Swiper(".main-bookmark-wrap .swiper", {
    slidesPerView: 4,
    spaceBetween: 10,

    pagination: {
      el: ".main-bookmark-wrap .swiper-pagination",
      clickable: true,
      type: "bullets",
    },

    navigation: {
      nextEl: ".main-bookmark-wrap .swiper-button-next",
      prevEl: ".main-bookmark-wrap .swiper-button-prev",
    },
  });

  responsiveSwiper();

  function responsiveSwiper() {
    if (ww >= 769) {
      swiper.destroy();
      swiper = new Swiper(".main-bookmark-wrap .swiper", {
        slidesPerView: 4,
        spaceBetween: 10,

        pagination: {
          el: ".main-bookmark-wrap .swiper-pagination",
          clickable: true,
          type: "bullets",
        },

        navigation: {
          nextEl: ".main-bookmark-wrap .swiper-button-next",
          prevEl: ".main-bookmark-wrap .swiper-button-prev",
        },
      });
    } else if (ww < 769) {
      swiper.destroy();
      swiper = new Swiper(".main-bookmark-wrap .swiper", {
        slidesPerView: 2,
        grid: {
          rows: 3,
          fill: "row",
        },
        spaceBetween: 15,

        pagination: {
          el: ".main-bookmark-wrap .swiper-pagination",
          clickable: true,
          type: "fraction",
        },

        navigation: {
          nextEl: ".main-bookmark-wrap .swiper-button-next",
          prevEl: ".main-bookmark-wrap .swiper-button-prev",
        },
      });
    }
  }

  window.addEventListener("resize", function () {
    ww = window.innerWidth;
    responsiveSwiper();
  });
}

function MySliderContents() {
  let swiper = new Swiper(".main-combi-contents-wrap .swiper", {
    slidesPerView: 1,
    spaceBetween: 60,

    breakpoints: {
      768: {
        slidesPerView: 1, //브라우저가 768보다 클 때
      },

      1024: {
        slidesPerView: 2, //브라우저가 1024보다 클 때
        spaceBetween: 20,
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

    observer: true,
    observeParents: true,
  });
}

function MySliderComplaint() {
  let swiper = new Swiper(".main-complaint-wrap .swiper", {
    slidesPerView: 1,

    pagination: {
      el: ".main-complaint-wrap .swiper-pagination",
      clickable: true,
      type: "fraction",
    },

    navigation: {
      nextEl: ".main-complaint-wrap .swiper-button-next",
      prevEl: ".main-complaint-wrap .swiper-button-prev",
    },

    breakpoints: {
      768: {
        slidesPerView: 2, //브라우저가 768보다 클 때
        spaceBetween: 20,
      },

      1024: {
        slidesPerView: 3, //브라우저가 1024보다 클 때
        spaceBetween: 20,
      },
    },

    observer: true,
    observeParents: true,
  });
}

MySliderMainVisual();
MySliderBookmark();
MySliderContents();
MySliderComplaint();
