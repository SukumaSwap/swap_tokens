# Swap functionality
This is repo contains code of how to agregate price from deffirent market makers ang get best price.
it also protects users from MEV attacks and risks of beeing recked

huge shoutout to the folowing resource 
https://0x.org/docs/0x-swap-api/api-references/get-swap-v1-price

use https://browserify.org/ to use backend packages on the client side.

below are commands to install and run browserify
npm install --save-dev browserify
npx browserify index.js --standalone bundle -o bundle.js
price aggregators include:mobula  and https://dashboard.0x.org/apps

endpoint to fetch token symbol and name : https://tokens.coingecko.com/uniswap/all.json

API to convert token price to  any fiat currency : https://api.coingecko.com/api/v3/simple/price'