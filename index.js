const axios = require('axios')
const cheerio = require('cheerio');

const pages = [
  'Timeline_of_antisemitism',
  'Timeline_of_antisemitism_in_the_19th_century',
  'Timeline_of_antisemitism_in_the_20th_century',
  'Timeline_of_antisemitism_in_the_21st_century'
]

module.exports = class TimeLine {
  get pages() {
    return pages
  }

  getSectionAndContent(page, section=1) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${page}&section=${section}&format=json`
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
          const bullets = []
          $('dl').each(function() {
            const date = $(this).find('dt').text()
            const description = $(this).find('dd').text()
            bullets.push({date, description})
          })
          resolve({section, bullets})
        })
        .catch(reject)
    })
  }

  getAllBullets() {
  }
  
  getBulletsForPage(page) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${page}&prop=sections&format=json`
    return new Promise((resolve, reject) => {
      axios.get(url)
      .then(response => {
        const sections = response.data.parse.sections
        Promise.all(sections.map(section => this.getSectionBullets(page, section.index)))
          .then(bullets => {
            resolve(bullets)
          })

      })
      .catch(reject)
    })
  }
}
