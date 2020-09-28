const puppeteer = require('puppeteer')
const Product = require('../db/models/Product')

let querySearch = 'placas-mae'

module.exports = async () => {

    try {
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36')

        await page.goto(`https://www.kabum.com.br/hardware/${querySearch}?pagina=1`)
        console.log('Awaiting page to load...')

        await page.waitForSelector('.sc-fzozJi.dIEkef')
        console.log('Caching total number of pages')

        await page.$eval('.sc-fzolEj.fblIKl', div => div.click())
        await page.waitForSelector('.sc-fzozJi.dIEkef')

        const numberOfPages = await page.$eval('.sc-fzqBkg.eERuQY .atual', div => {
            return parseInt(div.innerText.match(/(?<=\[).*?(?=])/gs)[0])
        })
        console.log(`Total of pages for navigation: ${numberOfPages}`)
        await page.goto(`https://www.kabum.com.br/hardware/${querySearch}?pagina=1`)
        await page.waitForSelector('.sc-fzozJi.dIEkef')
        console.log('Page loaded!')

        for (let j = 10; j < numberOfPages; j++) {
            await page.goto(`https://www.kabum.com.br/hardware/${querySearch}?pagina=${j + 1}`)
            await page.waitForSelector('.sc-fzozJi.dIEkef')
            const links = await page.$$('.sc-fzozJi.dIEkef > a')

            console.log('There are [%s] links in page [%s]', links.length, j + 1)

            console.log(links)
            for (let i = 0; i < links.length; i++) {
                await page.goto(`https://www.kabum.com.br/hardware/${querySearch}?pagina=${j + 1}`)
                await page.waitForSelector('.sc-fzozJi.dIEkef')
                await page.$$('.sc-fzozJi.dIEkef > a')
                    .then(link => link[i].click())
                    .catch(console.log)


                console.log(`Beginning scrapping of link ${i + 1} of page ${j + 1}...`)

                await page.waitForSelector('#titulo_det')

                const product_sku = await page.$eval('[data-produto]', element => element.getAttribute('data-produto'))

                const product_img = await page.$eval('#imagem-slide > li > img', element => element.getAttribute('src'))
                    .catch(err => err.message)

                const product_name = await page.$eval('#titulo_det', element => element.innerText)
                    .catch(err => err.message)

                const product_manufacturer = await page.$('.marcas meta')
                    ? await page.$eval('.marcas meta', element => element.getAttribute('content'))
                    : "Sem fabricante definido"

                const product_price = await page.$('.preco_normal')
                    ? await page.$eval('.preco_normal', element => element.innerText)
                    : "Sem preço no momento"

                const product_link = await page.evaluate(() => location.href)

                console.debug('Storing product on database')
                const data = {
                    retailer: 'Kabum',
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
                    console.debug(data)
                    // await Product.create(data)
                } else {
                    console.debug(data)
                    // await Product.update(
                    //     {
                    //         name: data.name,
                    //         manufacturer: data.manufacturer,
                    //         price: data.price,
                    //         link: data.link,
                    //         imageUrl: data.imageUrl
                    //     },
                    //     {
                    //         where: { id: skuCheck.id }
                    //     }
                    // )
                }
                console.debug('Storage completed!')

                console.log(`Scrapping completed on link ${i + 1} of page ${j + 1}...`)

            }
        }


        await browser.close()

    } catch (error) {
        console.log('our error', error)
    }



}