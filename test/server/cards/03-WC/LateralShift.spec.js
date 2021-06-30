describe('Lateral Shift', function () {
    describe("Lateral Shift's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    hand: ['lateral-shift', 'murkens', 'troll']
                },
                player2: {
                    amber: 6,
                    inPlay: ['spyyyder'],
                    hand: [
                        'bulwark',
                        'shooler',
                        'gorm-of-omm',
                        'gateway-to-dis',
                        'virtuous-works',
                        'armageddon-cloak',
                        'collar-of-subordination'
                    ]
                }
            });
        });

        it('should be able to see the cards', function () {
            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(false);
            }

            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');

            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(true);
            }
        });

        it("should be able to play a creature from opponent's hand", function () {
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.shooler);
            expect(this.shooler.location).toBe('play area');
            expect(this.player1.player.cardsInPlay).toContain(this.shooler);
            expect(this.player2.player.cardsInPlay).not.toContain(this.shooler);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should be able to play an artifact from opponent's hand", function () {
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            this.player1.clickCard(this.gormOfOmm);
            expect(this.gormOfOmm.location).toBe('play area');
            expect(this.player1.player.cardsInPlay).toContain(this.gormOfOmm);
            expect(this.player2.player.cardsInPlay).not.toContain(this.gormOfOmm);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should be able to play an action from opponent's hand", function () {
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            this.player1.clickCard(this.virtuousWorks);
            expect(this.player1.amber).toBe(5);
            expect(this.lateralShift.location).toBe('discard');
            expect(this.player1.player.discard).not.toContain(this.virtuousWorks);
            expect(this.player2.player.discard).toContain(this.virtuousWorks);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not be able to play an upgrade since there is no creature in play', function () {
            this.player2.moveCard(this.spyyyder, 'discard');
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            expect(this.player1).not.toBeAbleToSelect(this.collarOfSubordination);
            expect(this.player1).not.toBeAbleToSelect(this.armageddonCloak);
        });

        it('should be able to play an upgrade if there is a creature in play', function () {
            this.player1.play(this.troll);
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            expect(this.player1).toBeAbleToSelect(this.collarOfSubordination);
            expect(this.player1).toBeAbleToSelect(this.armageddonCloak);
            this.player1.clickCard(this.armageddonCloak);
            this.player1.clickCard(this.troll);
            expect(this.armageddonCloak.controller).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not be able to play Collar on opponent creature and take control of it', function () {
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            this.player1.clickCard(this.collarOfSubordination);
            this.player1.clickCard(this.spyyyder);
            expect(this.collarOfSubordination.controller).toBe(this.player1.player);
            expect(this.spyyyder.controller).toBe(this.player1.player);
        });
    });

    describe('Lateral Shift and onAbilityInitiated events', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    inPlay: ['troll'],
                    hand: ['lateral-shift', 'murkens', 'troll'],
                    discard: ['anger', 'relentless-assault']
                },
                player2: {
                    amber: 4,
                    inPlay: ['dextre'],
                    discard: ['virtuous-works', 'flaxia', 'infighting'],
                    hand: ['mimicry', 'mimic-gel', 'shield-of-justice']
                }
            });
        });

        it("Mimicry should play from opponent's discard", function () {
            this.player1.play(this.lateralShift);
            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(true);
            }
            this.player1.clickCard(this.mimicry);
            expect(this.player1).toBeAbleToSelect(this.virtuousWorks);
            expect(this.player1).toBeAbleToSelect(this.infighting);
            expect(this.player1).not.toBeAbleToSelect(this.shieldOfJustice);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.anger);
            expect(this.player1).not.toBeAbleToSelect(this.relentlessAssault);
            this.player1.clickCard(this.virtuousWorks);
            expect(this.player1.amber).toBe(5);
        });

        it("Mimic Gel should play on player's side", function () {
            this.player1.play(this.lateralShift);
            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(true);
            }
            this.player1.clickCard(this.mimicGel);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Left');
            expect(this.player2.amber).toBe(3);
            expect(this.mimicGel.amber).toBe(1);
            expect(this.mimicGel.controller).toBe(this.player1.player);
        });
    });
});
