define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'hb!../templates/post-template.html'
], function($, _, Backbone, Handlebars, PostTemplate){
    var View = Backbone.View.extend({
        el: $('#wrapper > .content'),
        html: false,
        id: 0,
        template: function(id) {
            var a = $.Deferred();
            var $this = this;
            $.get('api/posts/' + id).success(function(post){
                var html = PostTemplate(post);
                var persistingTitle = ' - Blog ' + $('title').text().split('|')[1];
                $('title').text(post.title + ' |' +  persistingTitle);
                $this.html = html;
                a.resolve();
            });
            return a;
        },
        registerClickEvents: function() {
            this.$('#back-button').click(function(e){
                e.preventDefault();
                Backbone.history.history.back();
            })
        },
        render: function(id) {
            if(this.html === false || this.id !== id ) {
                var $this = this;
                this.template(id).done(function(){
                    $this.$el.html($this.html);
                    $this.registerClickEvents();
                });
            } else {
                this.$el.html(this.html);
                this.registerClickEvents();
            }
        },
    });
    return View;
});
