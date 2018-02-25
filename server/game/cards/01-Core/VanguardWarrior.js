const DrawCard = require('../../drawcard.js');

class VanguardWarrior extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to put fate on one character',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'placeFate'
            },
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to put one fate on {2}', context.player, this, context.target);
                this.game.applyGameAction(context, { placeFate: context.target });
            }
        });
    }
}

VanguardWarrior.id = 'vanguard-warrior';

module.exports = VanguardWarrior;
