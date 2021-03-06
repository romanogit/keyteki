const Card = require('../../Card.js');

class Snag extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.nextRoundEffect((context) => ({
                targetController: 'opponent',
                effect: ability.effects.restrictHouseChoice(
                    context.event.attackerTarget.getHouses()
                )
            }))
        });
    }
}

Snag.id = 'snag';

module.exports = Snag;
