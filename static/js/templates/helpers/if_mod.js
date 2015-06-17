define(['underscore','hbs_handlebars'], function(_, Handlebars){
    function ifMod(index, modulo, result, options){
        if (index % modulo == result) {
            return options.fn()
        } else {
            return options.inverse(this);
        }
    };
    Handlebars.registerHelper('if_mod', ifMod);
    return ifMod;
});
