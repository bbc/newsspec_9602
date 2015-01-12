define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/liveTicker.html',
    'models/calculator'
], function (news, Backbone, htmlTemplate, Calculator) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.player = this.userModel.player();
            this.startTime = Date.now();
            _.bindAll(this, 'updateTicker');
        },
        render: function () {
            this.$el.html(this.template());

            this.yourselfEl = this.$el.find('.earned__yourself');
            this.nationalAvgEl = this.$el.find('.earned__national-avg');
            this.playerAvgEl = this.$el.find('.earned__player');
            this.playerIconEl = this.$el.find('.icon__player');
            this.playerTextEl = this.$el.find('.player_earned_text');

            this.updateTicker();
            setInterval(this.updateTicker, 500);

            this.updatePlayerText();
            this.loadPlayerSVG();

            return this.$el;
        },
        updatePlayerText: function () {
            var playerText = '{PLAYER_NAME} has earned',
                processText = playerText.replace('{PLAYER_NAME}', this.player.get('name'));
            this.playerTextEl.text(processText);
        },
        loadPlayerSVG: function () {
            var self = this;

            var playerId = this.player.get('id');
            self.playerIconEl.load('img/svg/footballers-' + playerId + '.svg', null);
        },
        updateTicker: function () {
            this.updateValue(this.yourselfEl, this.userModel.incomePPP());
            this.updateValue(this.nationalAvgEl, this.userModel.country().get('annual_wage'));
            this.updateValue(this.playerAvgEl, this.player.get('annual_wage'));
        },
        updateValue: function (element, annualSalary) {
            var pppEarned = Calculator.amountEarned(annualSalary, this.startTime, Date.now()),
                localEarned = Calculator.pppToLocal(this.userModel.country().get('ppp'), pppEarned),
                currencySymbol = this.userModel.country().get('currency_symbol');
            element.text(currencySymbol + '' + localEarned.toFixed(2));
        }
    });
});