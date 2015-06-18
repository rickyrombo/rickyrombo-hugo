define('nav', ['jquery', 'router'], function($, Router){
    var refresh = function() {
		$('a[target!="_blank"]').click(function(e){
			e.preventDefault();
			Backbone.history.navigate(e.target.getAttribute('href'), {trigger: true});
			if ($(e.target).hasClass('push-state')){
				$('.navbar-toggle').click();
			}
		});
	};
	$(document).ready(function(){
        refresh();
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
	return { refresh: refresh };
});
