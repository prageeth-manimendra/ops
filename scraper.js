const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeOdooPartners() {
  try {
    console.log('Starting scrape...');
    const { data } = await axios.get('https://www.odoo.com/partners/country/sri-lanka-125', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    const partners = [];
    
    $('.o_partner_card').each((i, el) => {
      partners.push({
        name: $(el).find('h5').text().trim(),
        link: 'https://www.odoo.com' + $(el).find('a').attr('href'),
        grade: $(el).find('.o_partner_grade').text().trim(),
        description: $(el).find('.o_partner_description').text().trim()
      });
    });
    
    fs.writeFileSync('partners.json', JSON.stringify(partners, null, 2));
    fs.writeFileSync('docs/partners.json', JSON.stringify(partners, null, 2));
    console.log('Scraped', partners.length, 'partners');
  } catch (error) {
    console.error('Scraping failed:', error.message);
    process.exit(1);
  }
}

scrapeOdooPartners();
