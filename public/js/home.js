$(document).ready(function() {

  var tl = new TimelineLite()
  var search_active = false
  var $el = $('.content')
  var $city = $('.city')
  var during_animation = false
  var expired_cookie = 60

  $('.container-slider').slick({
    arrows: false ,
    dots: true
  })

    $('.first-screen').show()
  if ($.cookie('popup') != '1') {
    $('.first-screen').show()
  } else {
    $('.first-screen').hide()
  }

  $('.btn-next').on('click' , function() {
    $('.first-screen').addClass('hide')
    $.cookie('popup' , '1' , {expires: expired_cookie})
  })

  

  $('.back-btn').on('click' , function() {
    $('.container-search').removeClass('hide')
    $('.btn-back').removeClass('show')
    $('.container-jumbo--search').removeClass('show')
    TweenLite.to($city , 2.2 , {
      x: 0 ,
      ease: Power4.easeOut
    })
    tl.staggerTo($el , 1 , {
      x: 0 ,
      autoAlpha: 1 ,
      ease: Circ.easeOut 
    } , .05)
    TweenLite.to('.container-slider' , 2.2 , {
      x: 0 ,
      autoAlpha: 1 ,
      ease: Power4.easeOut
    })
  })

  $('.search-control').focus(function() {
    if (!during_animation) {
      during_animation = true
      $('.container-search').addClass('hide')
      $('.btn-back').addClass('show')
      TweenLite.to('.container-slider' , 2.2 , {
        x: -300 ,
        autoAlpha: 0 ,
        ease: Power4.easeOut
      })
      setTimeout(() => {
        $('.container-jumbo--search').addClass('show')
      }, 160);
      TweenLite.to($city , 2.2 , {
        x: -300 ,
        ease: Power4.easeOut
      })
      tl.staggerTo($el , 1 , {
        x: -80 ,
        autoAlpha: 0 ,
        ease: Circ.easeOut 
      } , .05)
      setTimeout(() => {
        during_animation = false
      }, 250);
    }

  })       
})