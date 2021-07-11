const TimeLine = require('./index')

describe('getSectionAndContent', () => {
  it('gets a section', (done) => {
    const timeline = new TimeLine()

    timeline.getSectionAndContent(timeline.pages[0], 1)
      .then(response => {
        expect(response)
        done()
      })
      .catch(done)
  })

  it('gets a page', (done) => {
    const timeline = new TimeLine()

    timeline.getSectionAndContent(timeline.noSectionPages[0])
      .then(response => {
        expect(response)
        done()
      })
      .catch(done)
  })
});

describe('getSectionBullets', () => {
  it('gets a sections bullets', (done) => {
    const timeline = new TimeLine()
    timeline.getSectionBullets(timeline.pages[0], 1)
      .then(response => {
        expect(response)
        done()
      })
      .catch(done)
  })
});

describe('getBulletsForPage', () => {
  it('gets a pages bullets', (done) => {
    const timeline = new TimeLine()

    timeline.getBulletsForPage(timeline.pages[1])
      .then(response => {
        expect(response)
        done()
      })
      .catch(done)
  })
});

describe('getAllBullets', () => {
  it('gets all bullets', (done) => {
    const timeline = new TimeLine()

    timeline.getAllBullets()
      .then(response => {
        expect(response)
        done()
      })
      .catch(done)
  })
});