'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { raw } = require('body-parser');
const Stock = require('../models').Stock;
const apiUrl = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/';

async function isAddressMatch(rawAddress, storedHashes) {
  try {
    // check all hashes
    const matchFound = await Promise.any(
      storedHashes.map((hash) => bcrypt.compare(rawAddress, hash))
    );
    return matchFound;
  } catch {
    return false;
  }
};

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async (req, res) => {
      try {
        const { stock, like } = req.query;
        const rawAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // normalise to an array in cases when only one stock is requested
        const stockArray = Array.isArray(stock) ? stock : [stock];

        const stockDetails = await Promise.all(
          stockArray.map(async (symbol) => {
            try {
              const stockSymbol = symbol.toUpperCase();

              // fetch stock price from external API
              const response = await fetch(`${apiUrl}${symbol}/quote`);
              if (!response.ok) {
                throw new Error(`Failed to fetch data for stock: ${stockSymbol}`);
              }
              const apiData = await response.json();
              const price = apiData.latestPrice;

              // find existing or create stock entry in the database
              let dbStock = await Stock.findOne({ stock: stockSymbol });
              if (!dbStock) {
                dbStock = await Stock.create({
                  stock: stockSymbol,
                  likecount: 0,
                  address: [],
                });
              }

              // Check if client address is in stored addresses for stock
              const isMatch = await isAddressMatch(rawAddress, dbStock.address)

              // Update likecount and store hashed address
              if (like === 'true' && !isMatch) {
                const hashedAddress = await bcrypt.hash(rawAddress, 10);
                dbStock.likecount += 1;
                dbStock.address.push(hashedAddress);
                await dbStock.save();
              }

              // Return combined stock details
              return {
                stock: stockSymbol,
                price,
                likes: dbStock.likecount,
              };
            } catch (error) {
              console.error(`Error processing stock: ${symbol}`, error.message);
              return null; // Skip this stock if there's an error
            };
          })
        );

        if (stockDetails.length == 1) {
          res.json({
            'stockData': stockDetails[0]
          });
        } else {
          // calc relative likes for the two stocks
          const relLikes = stockDetails[0].likes - stockDetails[1].likes;
          // change likes to relative likes
          stockDetails[0]['rel_likes'] = relLikes;
          delete stockDetails[0].likes;
          stockDetails[1]['rel_likes'] = -relLikes;
          delete stockDetails[1].likes;

          res.json({
            'stockData': stockDetails
          });
        };

      } catch (err) {
        console.log('Error in GET request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    });

};
