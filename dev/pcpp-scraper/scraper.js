/* eslint-disable no-undef */
await (async (limit, sleep=2000) => {
  // https://pcpartpicker.com/products/monitor/#xcx=0&page=1

  const scrapeMonitors = () =>
      Array.from(document.querySelectorAll('tr.tr__product'))
          .map(p => ({
              id: p.querySelector('td.td__name a').getAttribute('href').split('/')[2],
              name: p.querySelector('div.td__nameWrapper > p').textContent,
              diagonal: parseFloat(Array.from(p.querySelector('td.td__spec--1').childNodes).filter(n => n.nodeType === Node.TEXT_NODE)[0].textContent),
              resolution: Array.from(p.querySelector('td.td__spec--2').childNodes).filter(n => n.nodeType === Node.TEXT_NODE)[0].textContent.split(' x ').map(n => parseInt(n)),
              path: 'https://pcpartpicker.com' + p.querySelector('td.td__name a').getAttribute('href')
          })
      );

  const lastPage = parseInt(document.querySelector('ul.pagination').lastElementChild.textContent);
  let currentPage = parseInt(location.hash.split('=').slice(-1)[0]);
  const maxPage = limit > 0 ? Math.min(limit + currentPage, lastPage) : lastPage;
  const allMonitors = [];

  let error;
  try {
    while (currentPage) {
        const monitors = scrapeMonitors();
        allMonitors.push(...monitors);
        console.log(`scraped ${monitors.length} monitors from page ${currentPage} / ${maxPage} (total: ${allMonitors.length})`);
        if (currentPage === maxPage) { break; }
        else { currentPage++; }
        document.querySelector(`ul.pagination li a[href="#page=${currentPage}"]`).click();
        await new Promise(r => setTimeout(r, sleep));
    }
  } catch (e) {
    error = e;
  }

  const scrapeTimestamp = (new Date(Date.now()))
    .toISOString()
    .split("-").join("")
    .split(":").join("")
    .slice(0,15).concat("Z");

  console.log(JSON.stringify(allMonitors));
  console.log(`pcpp-${scrapeTimestamp}.json`);

  if (error) throw error;
})(limit, sleep)