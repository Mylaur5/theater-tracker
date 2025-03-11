import os
import requests
import json
import time
from bs4 import BeautifulSoup
from datetime import datetime


# Setup the URL and folder paths
URL_OFFICIAL = "https://genshin-impact.fandom.com/wiki/Imaginarium_Theater/Seasons#Schedule"
OUTPUT_FILEPATH = "data/seasons_data.json"
ELEMENTS_URL = "/images/elements/{}"
CHARACTERS_URL = "/images/characters/{}"


def extract_season_dates(tr, season):
    td_date = tr.find_all("td")[0]
    season["name"] = td_date.a.text
    season["number"] = int(season["name"].split(" ")[1])
    text_split = td_date.small.text.split(" –")
    print("Found " + season["name"])

    season["date_start"] = text_split[0][:-6]
    season["date_end"] = text_split[1][:-6]
    season["version_start"] = text_split[0][-4:-1]
    season["version_end"] = text_split[1][-4:-1]
    season_start = datetime.strptime(season["date_start"], "%B %d, %Y")
    upcoming = (
        season_start.year > datetime.now().year
        or season_start.month > datetime.now().month
        and season_start.year == datetime.now().year
    )
    current = season_start.year == datetime.now().year and season_start.month == datetime.now().month
    season["status"] = "upcoming" if upcoming else "current" if current else "past"
    return season


def extract_images(tag):
    def get_name(span):
        name = span.span.a.img["alt"].lower().replace(" ", "_") + ".png"
        if name == "kazuha.png":
            name = "kaedehara_kazuha.png"
        return name

    os.makedirs("images/characters", exist_ok=True)
    return [
        {
            "name": span.span.a.img["alt"],
            "element": span["class"][-1].split("-")[2].capitalize(),
            "image_local": CHARACTERS_URL.format(get_name(span)),
            "image_url": span.span.a.img["data-src"],
        }
        for span in tag.find_next("span").find_all("span", class_="card-image-container")
    ]


def extract_elements(elements):
    L = []
    for _ in range(3):
        img = elements.find_next("span").a.img
        L.append(
            {
                "name": img["alt"],
                "image_local": ELEMENTS_URL.format(img["alt"].lower().replace(" ", "_") + ".png"),
                "image_url": img["data-src"],
            }
        )
        elements = elements.find_next("span")
    return L


def extract():
    script_directory = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_directory)

    # Measure time
    start_time = time.time()
    print("Starting the scraping process...")
    response = requests.get(URL_OFFICIAL)
    soup = BeautifulSoup(response.text, "html.parser")
    page = soup.find("div", class_="mw-parser-output")
    seasons = []
    for tr in page.find_all("tr"):
        season = {}
        if not tr.find("td"):
            continue

        season = extract_season_dates(tr, season)
        td_detail = tr.find_all("td")[1]
        opening = td_detail.b
        season["opening_characters"] = extract_images(opening)
        elements = opening.find_next("b")
        season["alternate_cast_elements"] = extract_elements(elements)
        special_guest = elements.find_next("b")
        season["special_guest_stars"] = extract_images(special_guest)
        seasons.append(season)

    with open(OUTPUT_FILEPATH, "w") as json_file:
        json.dump(seasons, json_file, indent=4)

    end_time = time.time()
    print(f"Script execution time: {end_time - start_time:.2f} seconds")
    print(f"Data successfully written to {OUTPUT_FILEPATH}")
    return OUTPUT_FILEPATH


if __name__ == "__main__":
    extract()
