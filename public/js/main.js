  $(document).ready(function() {
    // var path = '/pdf/regulasi/tes.pdf'
    // var options = {
    //     height: "400px",
    //     pdfOpenParams: { view: 'FitV', page: '2' }
    // };
    // PDFObject.embed(path, "#pdf", options); 
    // if(PDFObject.supportsPDFs){
    //    console.log("Yay, this browser supports inline PDFs.");
    // } else {
    //    console.log("Boo, inline PDFs are not supported by this browser");
    // }
    
    var color = ['#FC7EFF' , '#FE5959' , '#7EE0FF' , '#53FB29']
    var url

    $('.list-box').each(function(i) {
      var random = Math.floor(Math.random() * color.length)
      $('.list-box--bullet').eq(i)
        .css({ 'background' : color[random] })
    })

    $('.login-nav').on('click' , function() {
      $('.popup-login').toggleClass('active')
    })

    $('.popup-login').on('click' , function() {
      $(this).removeClass('active')
    })

    $('.popup-login--center').on('click' , function(evt) {
      evt.stopPropagation()
    })

    $('.burger-menu').on('click' , function() {
      $(this).toggleClass('active')
      $('.navbar-menu').toggleClass('active')
      $('#regulasi').toggleClass('active')
    })

    $('.list-box').on('click' , function() {
      url = $(this).data('url')
      console.log(url)
      $('.pdf-container').toggleClass('active')
    })

    $('.pdf-container').on('click' , function() {
      $(this).removeClass('active')
    })

    TweenMax.staggerFrom($('.list-box') , 1.2 , {
      y: -40 ,
      opacity: 0 ,
      ease: Expo.easeOut
    } , .3 )

  })