describe('Rhetor Gallim', function () {
    describe("Rhetor Gallim's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'saurian',
                    hand: ['rhetor-gallim'],
                    inPlay: ['senator-shrix']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access'],
                    inPlay: ['keyfrog']
                }
            });
        });

        it('should stop a key being forged when played', function () {
            this.player1.play(this.rhetorGallim);
            this.player1.endTurn();
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
        });

        it('should not stop forging a key in the same round it was played', function () {
            this.player1.fightWith(this.senatorShrix, this.keyfrog);
            this.player1.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(0);
        });
    });

    describe("Sensor Chief Garcia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'saurian',
                    inPlay: ['rhetor-gallim']
                },
                player2: {
                    amber: 6,
                    inPlay: ['dust-pixie'],
                    hand: ['remote-access']
                }
            });
        });

        it('should be optional to trigger after reap', function () {
            this.player1.reap(this.rhetorGallim);
            this.player1.clickPrompt('Done');
            expect(this.rhetorGallim.amber).toBe(0);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(0);
        });

        it('should stop a key being forged after reap and exalt', function () {
            this.player1.reap(this.rhetorGallim);
            this.player1.clickCard(this.rhetorGallim);
            expect(this.player1.amber).toBe(7);
            this.player1.endTurn();
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
        });
    });
});
