
$(document).ready(function() {
                var imgsrc = ["img/pic3.jpg", "img/bed.jpg","img/h4.jpg", "img/pic3.jpg", "img/bed.jpg", "img/h4.jpg"];
                var imgnum = 0;

                function start() {
                    $('#myimg').fadeOut(3000, function() {
                        imgnum++;
                        if(imgnum>4) {imgnum=0;}
                        $(this).attr("src",imgsrc[imgnum]);
                    }).fadeIn(3000, start);
                }
                start();

     
});