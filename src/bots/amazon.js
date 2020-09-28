const puppeteer = require('puppeteer')
const Product = require('../db/models/Product')

let querySearch = 'placa+mae'

module.exports = async () => {

    try {
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36')

        await page.goto(`https://www.amazon.com.br/s?k=${querySearch}&page=1`)
        console.log('Awaiting for page to load...')

        await page.waitForSelector('.a-size-base-plus.a-color-base.a-text-normal')
        console.log('Page loaded!')

        const numberOfPages = await page.$$eval('.a-pagination li', li => {
            return parseInt(li[li.length - 2].innerText)
        })
        console.log(`Total page number for navigation: ${numberOfPages}`)

        const links = await page.$$('.a-size-base-plus.a-color-base.a-text-normal')
        console.log(`Number of page links per page: ${links.length}`)

        let count = 1


        for (let j = 0; j < numberOfPages; j++) {

            await page.goto(`https://www.amazon.com.br/s?k=${querySearch}&page=${j + 1}`)
            await page.waitForSelector('.a-size-base-plus.a-color-base.a-text-normal')

            for (let i = 0; i < links.length; i++) {

                await page.goto(`https://www.amazon.com.br/s?k=${querySearch}`);
                await page.waitForSelector('.a-size-base-plus.a-color-base.a-text-normal')
                const links = await page.$$('.a-size-base-plus.a-color-base.a-text-normal')
                const link = links[i]

                link.click()

                console.log(`Beginning scrapping of link ${count} of page ${j + 1}...`)

                await page.waitForSelector('#productTitle')

                const product_sku = await page.$eval('#ASIN', element => element.value)

                const product_img = await page.$eval('#landingImage', element => element.dataset.oldHires)

                const product_name = await page.$eval('#productTitle', element => element.innerText)

                const product_manufacturer = await page.$('#bylineInfo')
                    ? await page.$eval('#bylineInfo', element => element.innerText)
                    : "Sem fabricante definido"

                const product_price = await page.$('#price_inside_buybox')
                    ? await page.$eval('#price_inside_buybox', element => element.innerText)
                    : "Sem preço no momento"

                const product_link = await page.evaluate(() => location.href)

                console.debug('Storing product on database')
                const data = ({
                    retailer: 'Amazon',
                    code: product_sku,
                    name: product_name,
                    manufacturer: product_manufacturer,
                    price: product_price,
                    link: product_link,
                    imageUrl: product_img
                })

                // console.log(data)

                await Product.create(data)
                console.debug('Storage completed!')

                console.log(`Scrapping completed on link ${count} of page ${j + 1}...`)
                count++
            }

        }


        await browser.close();

    } catch (error) {
        console.log('our error', error)
    }

}
