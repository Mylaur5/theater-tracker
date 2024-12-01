from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

url_future = 'https://homdgcat.wiki/gi/maze?lang=EN'

with sync_playwright() as p:
    browser = p.firefox.launch()
    page = browser.new_page()
    page.goto(url_future)
    
    # Get the page content and parse it with BeautifulSoup
    content = page.content()
    soup = BeautifulSoup(content, 'html.parser').text
    browser.close()
    print(soup.prettify())