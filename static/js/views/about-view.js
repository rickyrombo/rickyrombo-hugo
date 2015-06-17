define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'hb!../templates/page-template.html',
    'hb!../templates/about-template.html'
], function($, _, Backbone, Handlebars, PageTemplate, AboutTemplate){
    var View = Backbone.View.extend({
        el: $('#wrapper > .content'),
        html: false,
        template: function() {
            var a = $.Deferred();
            var title = 'About';
            var html = PageTemplate({
                title: title,
                tagline: ['I am human. What more do you want to know?'],
                main: AboutTemplate()
            });
            var persistingTitle = $('title').text().split('|')[1];
            $('title').text(title + ' |' +  persistingTitle);
            this.html = html;
            a.resolve();
            return a;
        },
        render: function() {
            if(this.html === false) {
                var $this = this;
                this.template().done(function(){
                    $this.$el.html($this.html);
                });
            } else {
                this.$el.html(this.html);
            }
        },
    });
    return View;
});
