
function changeBurgerState() {
    $(".header__content").toggleClass("header__content--active");
    $(".burger").toggleClass("burger--active");
    $(".nav").toggleClass("nav--active");
    $(".nav__list").toggleClass("nav__list--active");
    $(".header__account").toggleClass("header__account--active");
}

function changeScrollState() {
    $("body").toggleClass("scroll-lock");
    $("html").toggleClass("scroll-lock-html");
}

$(document).ready(function () {

    // mobile menu
    $('.burger').click(function () {
        changeScrollState();
        changeBurgerState();
    })

    // Popup
    $(".open-popup").click(function (e) {
        e.preventDefault();
        $(".popup__bg").fadeIn(400);
        $("body").addClass("scroll-lock");
        $("html").addClass("scroll-lock-html");

    });

    $(".close-popup").click(function () {
        $(".popup__bg").fadeOut(300);
        $("body").removeClass("scroll-lock");
        $("html").removeClass("scroll-lock-html");
        if ($(".header__content").hasClass('header__content--active')) {
            changeBurgerState();
        };
    });

    $(".stories__slider").slick({
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        mobileFirst: true,
        
    });

});


