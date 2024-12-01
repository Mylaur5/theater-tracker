import json

def import_good_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data
