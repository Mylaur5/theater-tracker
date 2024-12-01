import os
import requests
import json
import re
from bs4 import BeautifulSoup
import time

# Measure time
start_time = time.time()

# Main program statements
script_directory = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_directory)
print(os.getcwd())  # Current wd is backend

# Setup the URL and folder paths
url_official = 'https://genshin-impact.fandom.com/wiki/Imaginarium_Theater/Seasons#Schedule'
image_folder = '/images'  # Folder to save images

response = requests.get(url_official)
soup = BeautifulSoup(response.text, 'html.parser')

# Extract season information
page = soup.find('div', class_='mw-parser-output')

# Initialize a list to store all season data
all_seasons_data = []

# Find all season sections
season_sections = page.find_all('h3')

for season_section in season_sections:
	season_data = {}

	# Extract season name
	season_name = season_section.find('span', class_='mw-headline').text
	season_data['season_name'] = season_name

	# Extract Season Number and Version
	season_text = season_section.find_next('p').text

	# Check for "There are no upcoming seasons."
	if "There are no upcoming seasons." in season_text:
		season_data['season_number'] = None
		season_data['message'] = "There are no upcoming seasons."
		all_seasons_data.append(season_data)
		continue  # Skip to the next iteration of the loop

	season_number = re.search(r'Season (\d+)', season_text)
	season_data['season_number'] = season_number.group(0)

	# Extract version information
	version_info = re.search(r'Version ([\d.]+)', season_text)
	season_data['version_info'] = version_info.group(0)

	# Extract season date
	date_info = re.search(r'from (\w+) \d{2}, (\d+) to (\w+) \d{2}, \d{4}',
		season_text)
	season_data['date_info'] = date_info.group(1, 2)

	# Extract opening characters
	opening_characters = []
	card_list_container = season_section.find_next('span',
		class_='card-list-container')
	if card_list_container:
		cards = card_list_container.find_all('div', class_='card-container')
		for card in cards:
			character = {
				'name': card.find('span', class_='card-text').text.strip(),
				'element': card.find('span',
				class_='card-icon').find('img')['alt']
			}

			# Get the image URL
			image_url = card.find('span', class_='card-image-container').find(
				'img')['data-src'].split('/latest')[0] + '/latest'

			# Download and save the image locally
			image_name = f"{character['name'].replace(' ', '_').lower()}.png"
			os.makedirs(os.path.join(image_folder, 'characters'), exist_ok=True)
			image_character_path = os.path.join(image_folder, 'characters',
				image_name)
			flask_path = f'/images/characters/{image_name}'

			try:
				# Download the image
				img_response = requests.get(image_url, stream=True)
				if img_response.status_code == 200:
					with open(image_character_path, 'wb') as f:
						for chunk in img_response.iter_content(1024):
							f.write(chunk)
				# Add the local path and original URL to the character data
				character['image_local'] = flask_path
				character['image_url'] = image_url  # Keep the original link
			except Exception as e:
				print(f"Failed to download image for {character['name']}: {e}")
				character['image_local'] = None  # In case the download fails
				character[
					'image_url'] = image_url  # Keep the original link as fallback

			opening_characters.append(character)

	season_data['opening_characters'] = opening_characters

	# Extract alternate cast elements
	alternate_cast_elements = []
	alternate_cast_section = season_section.find_next('h4',
		string='Alternate Cast Elements')
	if alternate_cast_section:
		elements = alternate_cast_section.find_next('p').find_all('a')
		# Skip over empty element data (1 3 5 don't have img data)
		for i in range(0, len(elements), 2):
			element = elements[i]
			element_data = {
				'name':
				element.get('title'),
				'image_url':
				element.find('img')['data-src'].split('/revision')[0]
				if element.find('img') else None
			}

			if element_data['image_url']:
				# Download and save the image locally
				image_name = f"{element_data['name'].replace(' ', '_').lower()}.png"
				os.makedirs(os.path.join(image_folder, 'elements'),
					exist_ok=True)
				element_path = os.path.join(image_folder, 'elements',
					image_name)
				flask_element_path = f'/images/elements/{image_name}'

				try:
					# Download the image
					img_response = requests.get(element_data['image_url'],
						stream=True)
					if img_response.status_code == 200:
						with open(element_path, 'wb') as f:
							for chunk in img_response.iter_content(1024):
								f.write(chunk)
					# Add the local path to the element data
					element_data['image_local'] = flask_element_path
				except Exception as e:
					print(
						f"Failed to download image for {element_data['name']}: {e}"
					)
					element_data[
						'image_local'] = None  # In case the download fails

			alternate_cast_elements.append(element_data)

	season_data['alternate_cast_elements'] = alternate_cast_elements

	# Extract special guest stars
	special_guest_stars = []
	special_guest_section = season_section.find_next('h4',
		string='Special Guest Stars')
	if special_guest_section:
		card_list_container = special_guest_section.find_next('span',
			class_='card-list-container')
		if card_list_container:
			cards = card_list_container.find_all('div', class_='card-container')
			for card in cards:
				guest_star = {
					'name': card.find('span', class_='card-text').text.strip(),
					'element': card.find('span', 'card-icon').find('img')['alt']
				}

				# Get the image URL
				image_url = card.find('span',
					class_='card-image-container').find(
					'img')['data-src'].split('/latest')[0] + '/latest'

				# Download and save the image locally
				image_name = f"{guest_star['name'].replace(' ', '_').lower()}.png"
				image_character_path = os.path.join(image_folder, 'characters',
					image_name)
				flask_path = f'/images/characters/{image_name}'

				try:
					# Download the image
					img_response = requests.get(image_url, stream=True)
					if img_response.status_code == 200:
						with open(image_character_path, 'wb') as f:
							for chunk in img_response.iter_content(1024):
								f.write(chunk)
					# Add the local path and original URL to the guest star data
					guest_star['image_local'] = flask_path
					guest_star[
						'image_url'] = image_url  # Keep the original link
				except Exception as e:
					print(
						f"Failed to download image for {guest_star['name']}: {e}"
					)
					guest_star[
						'image_local'] = None  # In case the download fails
					guest_star[
						'image_url'] = image_url  # Keep the original link as fallback

				special_guest_stars.append(guest_star)

	season_data['special_guest_stars'] = special_guest_stars

	# Append season data to the list
	all_seasons_data.append(season_data)

# Extract season numbers and construct the filename
version_info = [
	season.get('version_info').split()[-1] for season in all_seasons_data
	if season.get('version_info') is not None
]
version_info_str = '-'.join(version_info)
filename = f"data/seasons_data_version_{version_info_str}.json"

# Write data to a JSON file
with open(filename, 'w') as json_file:
	json.dump(all_seasons_data, json_file, indent=4)

end_time = time.time()
execution_time = end_time - start_time
print(f"Script execution time: {execution_time:.2f} seconds")
print(f"Data successfully written to {filename}")
