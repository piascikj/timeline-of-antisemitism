const axios = require('axios')
const cheerio = require('cheerio');

const pages = [
  'Timeline_of_antisemitism',
  'Timeline_of_antisemitism_in_the_19th_century',
  'Timeline_of_antisemitism_in_the_20th_century'
]

const noSectionPages = [
  'Timeline_of_antisemitism_in_the_21st_century'
]

module.exports = class TimeLine {
  get pages() {
    return pages
  }

  get noSectionPages() {
    return noSectionPages
  }

  getSectionAndContent(page, section) {
    const sectionQuery = section ? `&section=${section}` : ''
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${page}${sectionQuery}&format=json`
    return new Promise((resolve, reject) => {
      axios.get(url)
      .then(response => {
        resolve({section: response.data.parse, content: response.data.parse.text['*']})
      })
      .catch(reject)
    })
  }

  getSectionBullets(page, section) {
    return new Promise((resolve, reject) => {
      this.getSectionAndContent(page, section)
        .then(({section, content}) => {
          const $ = cheerio.load(content)
          const dates = []
          const descriptions = []
          $('dl dt').each(function() {
            const date = $(this).text()
            dates.push(date)
          })
          $('dl dd').each(function() {
            const description = $(this).text()
            descriptions.push(description)
          })
          const bullets = dates.map((date, i) => ({date, description: descriptions[i]}))
          resolve({section, bullets})
        })
        .catch(reject)
    })
  }

  getNoSectionPageBullets(page) {
    return new Promise((resolve, reject) => {
      this.getSectionBullets(page)
      .then(noSectionPage => {
        resolve(noSectionPage.bullets)
      })
      .catch(reject)
    })

  }

  getAllBullets() {
    return new Promise((resolve, reject) => {
      const promises = pages.map(page => this.getBulletsForPage(page))
      promises.push(this.getNoSectionPageBullets(noSectionPages[0]))
      Promise.all(promises)
        .then(bullets => resolve(bullets.flat()))
        .catch(reject)
    })
  }
  
  getBulletsForPage(page) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${page}&prop=sections&format=json`
    return new Promise((resolve, reject) => {
      axios.get(url)
      .then(response => {
        const sections = response.data.parse.sections
        Promise.all(sections.map(section => this.getSectionBullets(page, section.index)))
          .then(sections => {
            const bullets = sections.map(section => section.bullets).flat()
            resolve(bullets)
          })
      })
      .catch(reject)
    })
  }
}
