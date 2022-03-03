import fetch from 'cross-fetch'
import taxRates from './data/taxRate.json'

/**
 * Get site titles of cool websites.
 *
 * Task: Can we change this to make the requests async so they are all fetched at once then when they are done, return all
 * the titles and make this function faster?
 *
 * @returns array of strings
 */

function checkStatus(response: { status: number; statusText: string | undefined }): Promise<any> {
  if (response.status === 200) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

async function parseText(response: Response) {
  return response.text()
}

function transform(data: string): string {
  const match = data.match(/<title>(.*?)<\/title>/)
  if (match?.length) {
    return match[1]
  } else {
    return 'null'
  }
}
export async function returnSiteTitles() {
  const urls = [
    'https://www.starwars.com/',
    'https://patientstudio.com/',
    'https://www.startrek.com/',
    'https://www.neowin.net/'
  ]
  const titles: string[] = []

  try {
    await Promise.all(
      urls.map(async url => {
        await fetch(url, { method: 'GET' })
          .then(checkStatus)
          .then(parseText)
          .then(data => {
            const title: string = transform(data)
            titles.push(title)
          })
      })
    ).then(result => {
      console.log('Result', result)
    })
  } catch (error) {
    console.log('error', error)
  }
  return [titles[2], titles[3], titles[0], titles[1]]
}

/**
 * Count the tags and organize them into an array of objects.
 *
 * Task: That's a lot of loops; can you refactor this to have the least amount of loops possible.
 * The test is also failing for some reason.
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function findTagCounts(localData: Array<SampleDateRecord>): Array<TagCounts> {
  const tagCounts: Array<TagCounts> = []
  localData.map(({ tags }) => {
    tags.map(tag => {
      const index = tagCounts.findIndex(element => element.tag === tag) || -1
      index > 0 ? tagCounts[index].count++ : tagCounts.push({ tag, count: 1 })
    })
  })
  return tagCounts
}

/**
 * Calcualte total price
 *
 * Task: Write a function that reads in data from `importedItems` array (which is imported above) and calculates the total price, including taxes based on each
 * countries tax rate.
 *
 * Here are some useful formulas and infomration:
 *  - import cost = unit price * quantity * importTaxRate
 *  - total cost = import cost + (unit price * quantity)
 *  - the "importTaxRate" is based on they destiantion country
 *  - if the imported item is on the "category exceptions" list, then no tax rate applies
 */
export function calcualteImportCost(importedItems: Array<ImportedItem>): Array<ImportCostOutput> {
  // please write your code in here.
  // note that `taxRate` has already been imported for you
  const costOutput: Array<ImportCostOutput> = []
  console.log(costOutput)
  importedItems.forEach((element: ImportedItem) => {
    const { name, unitPrice, quantity, countryDestination, category } = element
    const taxRateObject = taxRates.find(taxRate => taxRate.country === countryDestination)
    const taxRate: number = taxRateObject?.categoryExceptions.includes(category) ? 0 : taxRateObject?.importTaxRate
    const item: ImportCostOutput = {
      name: '',
      subtotal: 0,
      importCost: 0,
      totalCost: 0
    }
    item.name = name
    item.importCost = unitPrice * quantity * taxRate
    item.totalCost = item.importCost + unitPrice * quantity
    item.subtotal = item.importCost + item.totalCost

    costOutput.push(item)
  })
  return costOutput
}
