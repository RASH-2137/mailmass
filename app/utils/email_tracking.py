from bs4 import BeautifulSoup
from urllib.parse import quote_plus

from app.config import BASE_URL


def rewrite_links(html_body: str, log_id: int):

    soup = BeautifulSoup(
        html_body,
        "html.parser"
    )

    links = soup.find_all("a")

    for link in links:

        original_url = link.get("href")

        if not original_url:
            continue

        encoded_url = quote_plus(original_url)

        tracking_url = (
            f"{BASE_URL}/track/click/"
            f"{log_id}?url={encoded_url}"
        )

        link["href"] = tracking_url

    return str(soup)