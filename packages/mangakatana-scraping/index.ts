const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const { createWriteStream } = require('fs');
const https = require('https');


const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://mangakatana.com/');

    // scrape input search element and input search query
    await page.$eval('#input_search', (el: HTMLInputElement) => { el.value = 'Naruto' });

    // click search submit button
    await page.click('#searchsubmit');

    // select all search queries result
    await page.waitForSelector('#book_list');
    const listElement = await page.evaluate(() => {
        const list =  document.querySelector('#book_list');
        console.log({ list });
        return list;
    });

    console.log(listElement.childNodes)


    await page.screenshot({path: './example.png'});


  
    await browser.close();

    console.log('Finished');
};

/**
 * 
 * @param imageUrl - url to image file to download
 * @param path - path to store downloaded image to
 */
const downloadImage = (imageUrl: string, path: string) => {

};

const chapterScrapeFunction = async (page: any, chapterUrl: string, path: string, index: number) => {
    console.log({ page, chapterUrl, index })
    await page.goto(chapterUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
    await page.screenshot({path: './chapter.png'});


    // Get image src 
    const images = await page.$$eval('#imgs .wrap_img img', (img: any) => {
        return img.map((i: any) => {
            return i.dataset.src;
        })
    });
    // console.log({ images });

    console.log(images[0]);

    https.get(images[0], async (res: any) => {
        console.log({ res });
        console.log(res.path);
        const filepath = createWriteStream(`./test/${index}/0.jpg`)
        res.pipe(filepath);
        filepath.on('finish', () => {
            filepath.close();
            console.log('download completed');
        })
        // const filePath = fs.createWriteStream(path);
        // res.pipe(filePath);
        // filePath.on('finish',() => {
        //     filePath.close();
        //     console.log('Download Completed'); 
        // })
    });
    
    // const a = await page.evaluate(() => {
    //     const imagesElement = document.querySelectorAll('#imgs .wrap_img img');
    //     const converted = Array.from(imagesElement) as any;
    //     return fetch(converted[0].dataset.src);
    //     // return Array.from(imagesElement).map((el: any) => {
    //     //     const url = el.dataset.src;
    //     //     return url;
    //     //     // return await fetch(url);
    //     // })
    // });

};

const scrapeNaruto = async () => {
    console.log('start');
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://mangakatana.com/manga/naruto.1205');

    // Get chapter href location
    const chapters = await page.$$eval('td > div.chapter > a', (chapter: any) => {
        return chapter.map((chap: any) => {
            return chap.href;
        });
    });
    console.log(chapters);

    await chapterScrapeFunction(page, chapters[699], `./test/${1}`, 1);

    // await Promise.all(
    //     chapters.reverse().map(async (chapterUrl: string, index: number) => {
    //         await fs.mkdir(`./test/${index}`, { recursive: true });
    //         await chapterScrapeFunction(page, chapterUrl, `./test/${index}`, index);
    //     })
    // );



    await page.screenshot({path: './example.png'});



    await browser.close();
    console.log('Finished');
};

(async () => {
    await scrapeNaruto();
})();