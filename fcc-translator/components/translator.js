const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {

    timeTranslate(text, locale) {
        let result
        switch (locale) {
            case 'american-to-british':
                // US time 12:30 to GB time 12.30 replace $1.$2
                result = text.replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g, `<span class="highlight">${'$1.$2'}</span>`);
                break;
            case 'british-to-american':
                // GB time 12.30 to US time 12:30 replace $1:$2
                result = text.replace(/\b([01]?\d|2[0-3]).([0-5]\d)\b/g, `<span class="highlight">${'$1:$2'}</span>`);
        }
        return result;
    }

    wordsTranslate(text, locale) {
        let replacements;
        switch (locale) {
            case 'american-to-british':
                replacements = americanOnly;
                break;
            case 'british-to-american':
                replacements = britishOnly;
        }
        // Escape keys to safely use them in a regex
        const escapedKeys = Object.keys(replacements).map(key => key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
        // Create a regex to match all keys, case insensitive
        const regex = new RegExp(`\\b(${escapedKeys.join('|')})\\b`, 'gi');
        // Replace matches with corresponding values
        return text.replace(regex, match => {
            const result = replacements[match.toLowerCase()] || match;
            return `<span class="highlight">${result}</span>`;
        });
    }

    spellingTranslate(text, locale) {
        let replacements;
        switch (locale) {
            case 'american-to-british':
                replacements = americanToBritishSpelling;
                break;
            case 'british-to-american':
                // invert keys and values from americanToBritish object
                replacements = Object.fromEntries(
                    Object.entries(americanToBritishSpelling).map(([key, value]) => [value, key]))
        }
        // Create a regex to match only keys as whole words
        const escapedKeys = Object.keys(replacements).map(key => key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
        const regex = new RegExp(`\\b(${escapedKeys.join('|')})\\b`, 'gi');

        // Replace matches with their corresponding values
        return text.replace(regex, match => {
            const result = replacements[match.toLowerCase()] || match;
            return `<span class="highlight">${result}</span>`;
        });
    }

    titlesTranslate(text, locale) {
        let replacements;
        let regex;
        let escapedKeys;
        switch (locale) {
            case 'american-to-british':
                replacements = americanToBritishTitles;
                escapedKeys = Object.keys(replacements).map(key => key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
                regex = new RegExp(`\\b(${escapedKeys.join('|')})`, 'gi');
                break;
            case 'british-to-american':
                // invert keys and values from americanToBritish object
                replacements = Object.fromEntries(
                    Object.entries(americanToBritishTitles).map(([key, value]) => [value, key]));
                escapedKeys = Object.keys(replacements).map(key => key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
                regex = new RegExp(`\\b(${escapedKeys.join('|')})\\b(?!\\.)`, 'gi');
        }
        // Replace matches with their corresponding values
        return text.replace(regex, match => {
            const result = replacements[match] || match;
            return `<span class="highlight">${result}</span>`;
        });
    }

    translate(text, locale) {
        let result = this.timeTranslate(text, locale);
        result = this.wordsTranslate(result, locale);
        result = this.spellingTranslate(result, locale);
        result = this.titlesTranslate(result, locale);
        return result;
    }
}

module.exports = Translator;