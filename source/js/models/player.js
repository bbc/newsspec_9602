define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            'name': '',
            'club': '',
            'nationality': '',
            'league': '',
            'annual_wage': 0,
            'shirt_price': 0
        }
    });
});