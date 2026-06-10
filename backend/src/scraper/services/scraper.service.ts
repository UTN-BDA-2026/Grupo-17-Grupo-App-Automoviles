
import { Injectable } from '@nestjs/common'
import { chromium } from 'playwright'
import { LinkInput } from '../interfaces/link_input.dto';

@Injectable()
export class ScraperService {

    private userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/124.0.0.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/123.0.0.0',
        'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    ]

    private getRandomUserAgent(): { userAgent: string; headers: Record<string, string> } {
        
        const randomIndex = Math.floor(Math.random() * this.userAgents.length)
        const userAgent = this.userAgents[randomIndex]

        return {
            userAgent,
            headers: {
                'Accept-Language': 'es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
        }
    }


    public async scrapVehicle(url: string) : Promise<Object> {

        const { userAgent, headers } = this.getRandomUserAgent()

        const browser = await chromium.launch({ 
            headless: true,
            args: [
                '--disable-blink-features=AutomationControlled'
            ]
        })

        const context = await browser.newContext({
            userAgent,
            extraHTTPHeaders: headers
        })

        const page = await context.newPage()

            await page.goto(url, { waitUntil: 'networkidle' })

            const selectorCard = 'tr.andes-table__row'

            await page.waitForTimeout(Math.random() * (5000 - 2000) + 2000)
            await page.waitForSelector(selectorCard, {timeout: 100000})
            await page.mouse.wheel(0, 500)

            const technicalSheet = await page.locator(selectorCard).evaluateAll((rows) => {

            const data = {}

            rows.forEach(row => {
                const key = row.querySelector('th')?.children[0].textContent.trim()
                const value = row.querySelector('td')?.children[0].textContent

                if (key && value) {
                    data[key] = value;
                }
            })

            return data
        })

        const selectorPriceCurrency = 'span.andes-money-amount__currency-symbol'
        await page.waitForSelector(selectorPriceCurrency, {timeout: 50000})
        const moneda = await page.locator(selectorPriceCurrency).first().innerText()

        const selectorPriceNumber = 'span.andes-money-amount__fraction'
        await page.waitForSelector(selectorPriceNumber, {timeout: 50000})
        const precio = await page.locator(selectorPriceNumber).first().innerText()

        await page.close()
        await browser.close()

        return {
            precio,
            moneda,
            ...technicalSheet,
            url
        }

    }

    public async discoverVehicles(url: string) : Promise<LinkInput[]> {

        const { userAgent, headers } = this.getRandomUserAgent()

        const browser = await chromium.launch({ 
            headless: true,
            args: [
                '--disable-blink-features=AutomationControlled'
            ]
        })

        const context = await browser.newContext({
            userAgent,
            extraHTTPHeaders: headers
        })

        const page = await context.newPage()
        await page.goto(url, { waitUntil: 'networkidle' })

        const selectorCard = 'li.ui-search-layout__item'

        await page.waitForTimeout(Math.random() * (5000 - 2000) + 2000)
        await page.waitForSelector(selectorCard)
        await page.mouse.wheel(0, 500)

        const productos: LinkInput[] = await page.locator(selectorCard).evaluateAll((elementos) => {
            
            return elementos.map(el => {
                const enlaces = Array.from(el.querySelectorAll('a'))
                return {
                    link: enlaces[0].href,
                }
            })

        })

        await page.close()
        await browser.close()

        return productos 

    }

}
