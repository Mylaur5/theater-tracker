import timeit
from bs4 import BeautifulSoup
import requests
import shutil
import os
import re


def sanitize_filename(filename):
	# Remove invalid characters for Windows file names
	return re.sub(r'[<>:"/\\|?*]', '', filename)


def process_image(img_element, folder_name):
	img_src = img_element.get('src')
	img_link = f"{source_link}{img_src}"
	file_extension = os.path.splitext(img_src)[1]
	file_name = img_element.get('alt')

	# Skip images without an alt attribute or with an empty alt attribute
	if not file_name:
		print(
			f"Skipping image with src '{img_src}' due to missing or empty alt attribute."
		)
		return

	file_name = sanitize_filename(file_name).lower() + file_extension
	folder_name = folder_name.lower()
	destination_folder = f"images/{folder_name}/{file_name}"
	os.makedirs(f"images/{folder_name}", exist_ok=True)

	# Check if the file already exists and compare sizes
	if os.path.exists(destination_folder):
		existing_file_size = os.path.getsize(destination_folder)
		img_req = requests.get(img_link, stream=True)
		img_req.raw.decode_content = True
		new_file_size = int(img_req.headers.get('content-length', 0))

		if existing_file_size == new_file_size:
			print(
				f"Image '{file_name}' already exists and is identical. Skipping download."
			)
			return
	else:
		img_req = requests.get(img_link, stream=True)

	with open(destination_folder, 'wb') as f:
		shutil.copyfileobj(img_req.raw, f)
	print(
		f"Image '{file_name}' has been successfully downloaded and saved to '{destination_folder}'"
	)


def extract_images(h2, next_h2):
	images = []
	for sibling in h2.find_next_siblings():
		if sibling == next_h2:
			break
		images.extend(sibling.find_all('img'))
	return (h2.text, images)


# Start timing
start = timeit.default_timer()

# Main program statements
script_directory = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_directory)
print(os.getcwd())  # Current wd is backend

portrait_link = r'https://library.keqingmains.com/resources/tools/portraits'
source_link = r'https://library.keqingmains.com'
req = requests.get(portrait_link, stream=True)
page = BeautifulSoup(req.text, 'html.parser')

# Find all h2 elements
h2_elements = page.find_all("h2")

# Characters, Elements, Artifacts, Weapons, Misc
relevant_h2_elements = [h2_elements[i] for i in [2, 3, 4, 5, 6]]

# Use zip to pair each element with the next element
paired_h2_elements = zip(relevant_h2_elements,
	relevant_h2_elements[1:] + [None])

# Use map to find the relevant sections and their images
img_batches = list(
	map(lambda pair: extract_images(pair[0], pair[1]), paired_h2_elements))

# Process images and save them in the respective folders
for folder_name, img_batch in img_batches:
	list(map(lambda img: process_image(img, folder_name), img_batch))

# Stop timing
stop = timeit.default_timer()
execution_time = stop - start

print("Program Executed in " + str(execution_time) +
	" seconds")  # It returns time in seconds
