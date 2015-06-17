define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'hb!../templates/page-template.html',
    'hb!../templates/news-template.html',
    'hb!../templates/partials/post-summary.html',
], function($, _, Backbone, Handlebars, PageTemplate, NewsTemplate, PostPartial){
    var View = Backbone.View.extend({
        el: $('#wrapper > .content'),
        html: false,
        template: function() {
            var title = 'News';
            var $this = this;
            var a = $.Deferred();
            $.get('api/posts').success(function(posts){
                var newsHtml = NewsTemplate({
                    posts: posts
                },{
                    partials: {
                        post: PostPartial
                    }
                });
                var html = PageTemplate({
                    title: title,
                    tagline: ['...if there is any'],
                    main: newsHtml
                });
                var persistingTitle = $('title').text().split('|')[1];
                $('title').text(title + ' |' +  persistingTitle);
                $this.html = html;
                a.resolve();
            }).fail(function(){
                var html = PageTemplate({
                    title: title,
                    tagline: ['...if there is any'],
                    main: '<p> No news to show. </p>'
                });
                var persistingTitle = $('title').text().split('|')[1];
                $('title').text(title + ' |' +  persistingTitle);
                $this.html = html;
                a.reject();
            });
            return a;
        },
        registerClickEvents: function() {
            console.log(this.$('.post-link.push-state'));
            this.$('article.post a.push-state').click(function(e){
                e.preventDefault();
                Backbone.history.navigate(e.target.getAttribute('href'), {trigger: true});
            })
        },
        render: function() {
            if(this.html === false) {
                var $this = this;
                this.template().always(function(){
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
