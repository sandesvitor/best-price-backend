const puppeteer = require('puppeteer')
const Product = require('../db/models/Product')
require('../db/database/index')

let querySearch = 'placa+mae'

module.exports = async () => {

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        })
        const page = await browser.newPage()
        page.setDefaultNavigationTimeout(60000)
        page.setDefaultTimeout(60000)
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36')

        await page.goto(`https://www.amazon.com.br/s?k=${querySearch}&page=1`)
        console.log('Awaiting for page to load...')

        await page.waitForSelector('.a-link-normal.s-no-outline')
        console.log('Page loaded!')

        const numberOfPages = await page.$$eval('.a-pagination li', li => {
            return parseInt(li[li.length - 2].innerText)
        })
        console.log('Total of pages for navigation: [%s]', numberOfPages)

        for (let j = 0; j < numberOfPages; j++) {

            await page.goto(`https://www.amazon.com.br/s?k=${querySearch}&page=${j + 1}`)
            await page.waitForSelector('.a-link-normal.s-no-outline')
            const links = await page.$$('.a-link-normal.s-no-outline')

            console.log('There are [%s] links in page [%s]', links.length, j + 1)

            for (let i = 0; i < links.length; i++) {

                await page.goto(`https://www.amazon.com.br/s?k=${querySearch}`);
                await page.waitForSelector('.a-size-base-plus.a-color-base.a-text-normal')
                await page.$$('.a-size-base-plus.a-color-base.a-text-normal')
                    .then(link => link[i].click())
                    .catch(console.log)

                console.log('Beginning scrapping of link [%s] of page [%s]...', i + 1, j + 1)

                await page.waitForSelector('#productTitle')

                const product_sku = await page.$eval('#ASIN', element => element.value)

                const product_img = await page.$eval('#landingImage', element => element.dataset.oldHires)
                    .catch(err => err.message)

                const product_name = await page.$eval('#productTitle', element => element.innerText)
                    .catch(err => err.message)

                const product_manufacturer = await page.$('#bylineInfo')
                    ? await page.$eval('#bylineInfo', element => element.innerText)
                    : "Sem fabricante definido"

                const product_price = await page.$('#price_inside_buybox')
                    ? await page.$eval('#price_inside_buybox', element => element.innerText)
                    : "Sem preço no momento"

                const product_link = await page.evaluate(() => location.href)


                const data = {
                    retailer: 'Amazon',
                    code: product_sku,
                    name: product_name,
                    manufacturer: product_manufacturer,
                    price: product_price,
                    link: product_link,
                    imageUrl: product_img
                }

                const skuCheck = await Product.findOne(
                    {
                        where: { code: data.code }
                    }
                )

                if (!skuCheck) {
                    console.info('New Product!\nStoring product on database...')
                    console.info(data)
                    await Product.create(data)
                } else {
                    console.info('Product alread listed!\nUpdating...')
                    console.info(data)
                    await Product.update(
                        {
                            name: data.name,
                            manufacturer: data.manufacturer,
                            price: data.price,
                            link: data.link,
                            imageUrl: data.imageUrl
                        },
                        {
                            where: {
                                retailer: 'Amazon',
                                id: skuCheck.id
                            }
                        }
                    )
                }
                console.debug('Storage completed!')

                console.log('Scrapping completed for link [%s] of page [%s]...', i + 1, j + 1)
            }

        }


        await browser.close();

    } catch (error) {
        console.log('Amazon Scrapper Error: ', error)
    }

}