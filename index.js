const puppeteer = require("puppeteer");
const $ = require("cheerio");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const scbUrl = "https://www.scbeasy.com/v1.4/site/presignon/index.asp";

const main = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(scbUrl);
    await page.type("input[name=LOGIN]", process.env.LOGIN, { delay: 10 });
    await page.type("input[name=PASSWD]", process.env.PASSWORD, { delay: 10 });
    await page.click("#lgin");
    console.log("LOGIN")
    await page.waitFor("#form1 > table:nth-child(7) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td.nav-width > table > tbody > tr:nth-child(2) > td > a");
    // const cookies = await page.cookies()
    // console.log(cookies)
    await page.click(
      "#form1 > table:nth-child(7) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td.nav-width > table > tbody > tr:nth-child(2) > td > a"
    );
    console.log("GO TO MY ACCOUNT")
    await page.waitForSelector(
      "#DataProcess_SaCaGridView_SaCaView_LinkButton_0"
    );
    await page.click("#DataProcess_SaCaGridView_SaCaView_LinkButton_0");
    console.log("VIEW MY ACCOUNT")
    await page.waitForSelector("#DataProcess_Link2");
    await page.click("#DataProcess_Link2");
    console.log("VIEW MY TODAY's STATEMENT")
    await page.waitForSelector("td.bd_th_blk11_rtlt10_tpbt5");
    const content = await page.content();
    const array = [];
    const datas = [];
    const keys = [
      "date",
      "time",
      "order",
      "from",
      "transfer",
      "deposit",
      "detail"
    ];
    await $("td.bd_th_blk11_rtlt10_tpbt5", content).each(function() {
      array.push($(this).text());
    });
    console.log("READ YOUR STATEMENT")
    let i = 0;
    let j = 0;
    let obj = {}
    array.forEach((item, i) => {
      if (j > 6) {
        datas.push(obj)
        obj={}
        i += 1;
        j = 0;
      }
      obj[keys[j]] = item;
      j += 1;
    });
    await fs.writeFileSync('statement.json', JSON.stringify(datas))
    console.log("WRITE YOUR STATEMENT")
    console.log("DONE")
    await browser.close()
  } catch (error) {
    throw error;
  }
};
main();
