define('nav', ['jquery', 'router'], function($, Router){
    $(document).ready(function(){
        $('a.push-state').click(function(e){
            e.preventDefault();
            Backbone.history.navigate(e.target.getAttribute('href'), {trigger: true});
            $('.navbar-toggle').click();
        });
    });
    $('.navbar-toggle').click(function(e){
        e.preventDefault();
        var target = $(this).attr('data-target');
        if($(this).hasClass('collapsed')){
            //$(target).css('height', 'auto');
            //$(target).animate({height: '100%'});
            $(target).addClass('rr-expanded')
            $(this).removeClass('collapsed');
        } else {
            $(target).removeClass('rr-expanded');
            $(this).addClass('collapsed');
        }
    });
});
