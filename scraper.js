const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); 
    const page = await browser.newPage();
    const serviceTag = process.argv[2]; 
    
    await page.goto(`https://www.dell.com/support/home/pt-br/product-support/servicetag/${serviceTag}/overview`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1[aria-label="SystemDescription"]', { timeout: 30000 });
     
    const data = await page.evaluate(() => {
        const systemDescriptionElement = document.querySelector('h1[aria-label="SystemDescription"]');
        const serviceTagElement = document.querySelector('service-tag mb-0 d-none d-lg-block.font-weight-medium.text-jet');  

        return {
            systemDescription: systemDescriptionElement ? systemDescriptionElement.innerText.trim() : null,
            serviceTag: serviceTagElement ? serviceTagElement.innerText.trim() : null
        };
    });

    if (data.systemDescription) {
        console.log('System Description:', data.systemDescription);
    } else {
        console.log('Elemento de descrição do sistema não encontrado.');
    }

    if (data.serviceTag) {
        console.log('Código de Serviço Expresso:', data.serviceTag);
    } else {
        console.log('Código de Serviço Expresso não encontrado.');
    }

    await browser.close();  
})();
