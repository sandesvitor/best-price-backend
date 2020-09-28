const puppeteer = require('puppeteer')
const Product = require('../db/models/Product')

let querySearch = 'placas-mae'

module.exports = async () => {

    try {
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36')

        await page.goto(`https://www.kabum.com.br/hardware/${querySearch}?pagina=1&limite=100&prime=false&marcas=[]&tipo_produto=[]&filtro=[]`)
        console.log('Awaiting page to load...')

        await page.waitForSelector('.sc-fzozJi.dIEkef')
        console.log('Page loaded!')

        const numberOfPages = await page.$$eval('.sc-fzqBkg.eERuQY div', divs => {
            return parseInt(divs[divs.length - 1].innerText)
        })
        console.log(`Total page number for navigation: ${numberOfPages}`)

        const links = await page.$$('.sc-fzozJi.dIEkef a')
        console.log(`Number of page links per page: ${links.length}`)

        let count = 1

        for (let j = 0; j < numberOfPages; j++) {
            await page.goto(`https://www.kabum.com.br/hardware/${querySearch}?pagina=${j + 1}&limite=100&prime=false&marcas=[]&tipo_produto=[]&filtro=[]`)
            await page.waitForSelector('.sc-fzozJi.dIEkef')

            for (let i = 0; i < links.length; i++) {
                await page.goto(`https://www.kabum.com.br/hardware/${querySearch}?pagina=${j + 1}&limite=100&prime=false&marcas=[]&tipo_produto=[]&filtro=[]`)
                await page.waitForSelector('.sc-fzozJi.dIEkef')
                const links = await page.$$('.sc-fzozJi.dIEkef a')
                const link = links[i]

                link.click()

                console.log(`Beginning scrapping of link ${count} of page ${j + 1}...`)

                await page.waitForSelector('#titulo_det')

                const product_sku = await page.$eval('#pag-detalhes div span', element => element.innerText)

                const product_img = await page.$eval('.imagem_produto_descricao', element => element.getAttribute('src'))

                const product_name = await page.$eval('#titulo_det', element => element.innerText)

                const product_manufacturer = await page.$('.marcas meta')
                    ? await page.$eval('.marcas meta', element => element.getAttribute('content'))
                    : "Sem fabricante definido"

                const product_price = await page.$('.preco_normal')
                    ? await page.$eval('.preco_normal', element => element.innerText)
                    : "Sem preço no momento"

                const product_link = await page.evaluate(() => location.href)

                console.debug('Storing product on database')
                const data = ({
                    retailer: 'Kabum',
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


        await browser.close()

    } catch (error) {
        console.log('our error', error)
    }



}