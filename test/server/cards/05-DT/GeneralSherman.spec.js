describe('General Sherman', function () {
    describe("General Sherman's static ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['general-sherman']
                },
                player2: {
                    inPlay: ['narp'],
                    discard: []
                }
            });
        });

        it('should not deal damage when fighting', function () {
            this.player1.fightWith(this.generalSherman, this.narp);
            expect(this.narp.location).toBe('play area');
            expect(this.narp.tokens.damage).toBeUndefined();
            expect(this.generalSherman.tokens.damage).toBe(8);
        });
    });

    describe("General Sherman's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'unfathomable',
                    hand: ['general-sherman', 'sleep-with-the-fishes'],
                    inPlay: ['kaupe', 'deepwater-gruen']
                },
                player2: {
                    amber: 3,
                    hand: ['fangs-of-gizelhart', 'the-harder-they-come', 'protectrix'],
                    inPlay: ['narp', 'groke', 'alaka'],
                    discard: []
                }
            });
        });

        it('should purge all other creatures when played', function () {
            this.player1.play(this.generalSherman);
            expect(this.kaupe.location).toBe('purged');
            expect(this.deepwaterGruen.location).toBe('purged');
            expect(this.narp.location).toBe('purged');
            expect(this.groke.location).toBe('purged');
            expect(this.alaka.location).toBe('purged');
        });

        it('should return other creatures to play when destroyed', function () {
            this.player1.play(this.generalSherman);
            this.player1.play(this.sleepWithTheFishes);

            expect(this.player1).toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.deepwaterGruen);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.alaka);

            this.player1.clickCard(this.kaupe);
            this.player1.clickCard(this.deepwaterGruen);
            this.player1.clickPrompt('Left');

            this.player1.clickCard(this.narp);
            this.player1.clickCard(this.groke);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.alaka);
            this.player1.clickPrompt('Left');

            expect(this.kaupe.location).toBe('play area');
            expect(this.deepwaterGruen.location).toBe('play area');
            expect(this.narp.location).toBe('play area');
            expect(this.groke.location).toBe('play area');
            expect(this.alaka.location).toBe('play area');

            //gruen effects shouldn't occur
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });

        it('should purge and return non-warded creatures correctly if something is warded', function () {
            this.kaupe.tokens.ward = 1;

            this.player1.play(this.generalSherman);

            expect(this.kaupe.location).toBe('play area');
            expect(this.deepwaterGruen.location).toBe('purged');
            expect(this.narp.location).toBe('purged');
            expect(this.groke.location).toBe('purged');
            expect(this.alaka.location).toBe('purged');

            this.player1.play(this.sleepWithTheFishes);

            expect(this.player1).not.toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.deepwaterGruen);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.alaka);

            this.player1.clickCard(this.deepwaterGruen);
            this.player1.clickPrompt('Left');

            this.player1.clickCard(this.narp);
            this.player1.clickCard(this.groke);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.alaka);
            this.player1.clickPrompt('Left');

            expect(this.kaupe.location).toBe('play area');
            expect(this.deepwaterGruen.location).toBe('play area');
            expect(this.narp.location).toBe('play area');
            expect(this.groke.location).toBe('play area');
            expect(this.alaka.location).toBe('play area');
        });
    });
});
