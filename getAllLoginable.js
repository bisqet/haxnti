const fs = require('fs')

const nodeFetch = require('node-fetch');
const tough = require('tough-cookie');
const pptr = require('puppeteer')

var cookiejar = new tough.CookieJar();
cookiejar.setCookieSync("AIOHTTP_SESSION=2772e16f0f42479bb1a2cb3dec43f9c7", 'https://reg.nti-contest.ru/api/reg_stepik_acc');

const fetch = require('fetch-cookie')(nodeFetch, cookiejar)



const all = require('./all.js');

getAllLoginable(all);

const getAllLoginable =(allScrappedUsers)=>{
	
	for(let i of allScrappedUsers){
		
	}
}



//module.exports = getAllLoginable