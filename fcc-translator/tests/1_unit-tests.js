const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translate = new Translator();

suite('Unit Tests', () => {
    suite('American to British English tests', () => {
        test('Translate Mangoes are my favorite fruit. to British English', (done) => {
            assert.notInclude(translate.translate('Mangoes are my favorite fruit.', 'american-to-british'), 'favorite');
            assert.include(translate.translate('Mangoes are my favorite fruit.', 'american-to-british'), 'favourite');
            done();
        });
        test('Translate I ate yogurt for breakfast. to British English', (done) => {
            assert.notInclude(translate.translate('I ate yogurt for breakfast.', 'american-to-british'), 'yogurt');
            assert.include(translate.translate('I ate yogurt for breakfast.', 'american-to-british'), 'yoghurt');
            done();
        });
        test("Translate We had a party at my friend's condo. to British English", (done) => {
            assert.notInclude(translate.translate("We had a party at my friend's condo.", 'american-to-british'), 'condo');
            assert.include(translate.translate("We had a party at my friend's condo.", 'american-to-british'), 'flat');
            done();
        });
        test('Translate Can you toss this in the trashcan for me? to British English', (done) => {
            assert.notInclude(translate.translate('Can you toss this in the trashcan for me?', 'american-to-british'), 'trashcan');
            assert.include(translate.translate('Can you toss this in the trashcan for me?', 'american-to-british'), 'bin');
            done();
        });
        test('Translate The parking lot was full. to British English', (done) => {
            assert.notInclude(translate.translate('The parking lot was full.', 'american-to-british'), 'parking lot');
            assert.include(translate.translate('The parking lot was full.', 'american-to-british'), 'car park');
            done();
        });
        test('Translate Like a high tech Rube Goldberg machine. to British English', (done) => {
            assert.notInclude(translate.translate('Like a high tech Rube Goldberg machine.', 'american-to-british'), 'Rube Goldberg machine');
            assert.include(translate.translate('Like a high tech Rube Goldberg machine.', 'american-to-british'), 'Heath Robinson device');
            done();
        });
        test('Translate To play hooky means to skip class or work. to British English', (done) => {
            assert.notInclude(translate.translate('To play hooky means to skip class or work.', 'american-to-british'), 'play hooky');
            assert.include(translate.translate('To play hooky means to skip class or work.', 'american-to-british'), 'bunk off');
            done();
        });
        test('Translate No Mr. Bond, I expect you to die. to British English', (done) => {
            assert.notInclude(translate.translate('No Mr. Bond, I expect you to die.', 'american-to-british'), 'Mr.');
            assert.include(translate.translate('No Mr. Bond, I expect you to die.', 'american-to-british'), 'Mr');
            done();
        });
        test('Translate Dr. Grosh will see you now. to British English', (done) => {
            assert.notInclude(translate.translate('Dr. Grosh will see you now.', 'american-to-british'), 'Dr.');
            assert.include(translate.translate('Dr. Grosh will see you now.', 'american-to-british'), 'Dr');
            done();
        });
        test('Translate Lunch is at 12:15 today. to British English', (done) => {
            assert.notInclude(translate.translate('Lunch is at 12:15 today.', 'american-to-british'), '12:15');
            assert.include(translate.translate('Lunch is at 12:15 today.', 'american-to-british'), '12.15');
            done();
        });
    });
    suite('British to American English tests', () => {
        test('Translate We watched the footie match for a while. to American English', (done) => {
            assert.notInclude(translate.translate('We watched the footie match for a while.', 'british-to-american'), 'footie');
            assert.include(translate.translate('We watched the footie match for a while.', 'british-to-american'), 'soccer');
            done();
        });
        test('Translate Paracetamol takes up to an hour to work. to American English', (done) => {
            assert.notInclude(translate.translate('Paracetamol takes up to an hour to work.', 'british-to-american'), 'Paracetamol');
            assert.include(translate.translate('Paracetamol takes up to an hour to work.', 'british-to-american'), 'Tylenol');
            done();
        });
        test('Translate First, caramelise the onions. to American English', (done) => {
            assert.notInclude(translate.translate('First, caramelise the onions.', 'british-to-american'), 'caramelise');
            assert.include(translate.translate('First, caramelise the onions.', 'british-to-american'), 'caramelize');
            done();
        });
        test('Translate I spent the bank holiday at the funfair. to American English', (done) => {
            assert.notInclude(translate.translate('I spent the bank holiday at the funfair.', 'british-to-american'), 'bank holiday');
            assert.include(translate.translate('I spent the bank holiday at the funfair.', 'british-to-american'), 'public holiday');
            assert.notInclude(translate.translate('I spent the bank holiday at the funfair.', 'british-to-american'), 'funfair');
            assert.include(translate.translate('I spent the bank holiday at the funfair.', 'british-to-american'), 'carnival');
            done();
        });
        test('Translate I had a bicky then went to the chippy. to American English', (done) => {
            assert.notInclude(translate.translate('I had a bicky then went to the chippy.', 'british-to-american'), 'bicky');
            assert.include(translate.translate('I had a bicky then went to the chippy.', 'british-to-american'), 'cookie');
            assert.notInclude(translate.translate('I had a bicky then went to the chippy.', 'british-to-american'), 'chippy');
            assert.include(translate.translate('I had a bicky then went to the chippy.', 'british-to-american'), 'fish-and-chip shop');
            done();
        });
        test("Translate I've just got bits and bobs in my bum bag. to American English", (done) => {
            assert.notInclude(translate.translate("I've just got bits and bobs in my bum bag.", 'british-to-american'), 'bits and bobs');
            assert.include(translate.translate("I've just got bits and bobs in my bum bag.", 'british-to-american'), 'odds and ends');
            assert.notInclude(translate.translate("I've just got bits and bobs in my bum bag.", 'british-to-american'), 'bum bag');
            assert.include(translate.translate("I've just got bits and bobs in my bum bag.", 'british-to-american'), 'fanny pack');
            done();
        });
        test('Translate The car boot sale at Boxted Airfield was called off. to American English', (done) => {
            assert.notInclude(translate.translate('The car boot sale at Boxted Airfield was called off.', 'british-to-american'), 'car boot sale');
            assert.include(translate.translate('The car boot sale at Boxted Airfield was called off.', 'british-to-american'), 'swap meet');
            done();
        });
        test('Translate Have you met Mrs Kalyani? to American English', (done) => {
            assert.notInclude(translate.translate('Have you met Mrs Kalyani?', 'british-to-american'), 'Mrs ');
            assert.include(translate.translate('Have you met Mrs Kalyani?', 'british-to-american'), 'Mrs.');
            done();
        });
        test("Translate Prof Joyner of King's College, London. to American English", (done) => {
            assert.notInclude(translate.translate("Prof Joyner of King's College, London.", 'british-to-american'), 'Prof ');
            assert.include(translate.translate("Prof Joyner of King's College, London.", 'british-to-american'), 'Prof.');
            done();
        });
        test('Translate Tea time is usually around 4 or 4.30. to American English', (done) => {
            assert.notInclude(translate.translate("Tea time is usually around 4 or 4.30.", 'british-to-american'), '4.30');
            assert.include(translate.translate("Tea time is usually around 4 or 4.30.", 'british-to-american'), '4:30');
            done();
        });
    });
    suite('Highlight tests', () => {
        test('Highlight translation in Mangoes are my favorite fruit.', (done) => {
            assert.notInclude(translate.translate('Mangoes are my favorite fruit.', 'american-to-british'), 'favorite');
            assert.include(translate.translate('Mangoes are my favorite fruit.', 'american-to-british'), '<span class="highlight">favourite</span>');
            done();
        });
        test('Highlight translation in I ate yogurt for breakfast.', (done) => {
            assert.notInclude(translate.translate('I ate yogurt for breakfast.', 'american-to-british'), 'yogurt');
            assert.include(translate.translate('I ate yogurt for breakfast.', 'american-to-british'), '<span class="highlight">yoghurt</span>');
            done();
        });
        test('Highlight translation in We watched the footie match for a while.', (done) => {
            assert.notInclude(translate.translate('We watched the footie match for a while.', 'british-to-american'), 'footie');
            assert.include(translate.translate('We watched the footie match for a while.', 'british-to-american'), '<span class="highlight">soccer</span>');
            done();
        });
        test('Highlight translation in Paracetamol takes up to an hour to work.', (done) => {
            assert.notInclude(translate.translate('Paracetamol takes up to an hour to work.', 'british-to-american'), 'Paracetamol');
            assert.include(translate.translate('Paracetamol takes up to an hour to work.', 'british-to-american'), '<span class="highlight">Tylenol</span>');
            done();
        });
    })

});
