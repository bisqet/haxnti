const fs = require('fs')

const nodeFetch = require('node-fetch');
const tough = require('tough-cookie');
const pptr = require('puppeteer')

var cookiejar = new tough.CookieJar();
cookiejar.setCookieSync("AIOHTTP_SESSION=2772e16f0f42479bb1a2cb3dec43f9c7", 'https://reg.nti-contest.ru/api/reg_stepik_acc');

const fetch = require('fetch-cookie')(nodeFetch, cookiejar)



const all = require('./all.js');

getAllLoginable(all);

const getAllLoginable = (allScrappedUsers) => {
    const browserOptions = {
        headless: true,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            //'--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            //'--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
        ],
        defaultViewport: {
            width: 1280,
            height: 600,
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            isLandscape: false
        }
    }
    const browser = await puppeteer.launch(browserOptions);

    for (let i of allScrappedUsers) {

    }
}



//module.exports = getAllLoginable