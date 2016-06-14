/*----------------------------------*\
/*  SLIDER
/*----------------------------------*/
$(function() {
    $('.flexslider').flexslider({
        slideshowSpeed: 3000,
        fadeFirstSlide: false,
        controlNav: false,
    });

    // resume play
    $('.flex-next').click(function() {
        $('.flexslider').flexslider("play");
    });
    $('.flex-prev').click(function() {
        $('.flexslider').flexslider("play");
    });
    $('.flex-control-nav').click(function() {
        $('.flexslider').flexslider("play");
    });
});

function preCapt() {
    $('.flex-caption').fadeIn(300);
}
if (window.innerWidth > 500) {
    setTimeout(preCapt, 500);
}
/*----------------------------------*/
/*  SLICK  */
/*----------------------------------*/
$('.carousel').slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  nextArrow: '<div class="slick-next"></div>',
  prevArrow: '<div class="slick-prev"></div>',

});
/*----------------------------------*/
/*  FANCYBOX  */
/*----------------------------------*/
$(document).ready(function() {
  $(".fancybox").fancybox({
    openEffect  : 'none',
    closeEffect : 'none'
  });
});