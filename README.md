# Theater Tracker

Theater Tracker is a web application that tracks various elements and characters from the Imaginarium Theater. The project consists of a backend built with Flask and a frontend built with SvelteKit.

## Requirements

- Python (version 3.8 or higher)
- Node.js (version 14 or higher)
- npm (version 6 or higher)

## Dependencies

- Svelte
- Tailwind CSS
- Font: https://www.cufonfonts.com/font/hywenhei
- Icons: https://leshak.github.io/svelte-icons-pack

## Installation

### Backend

1. Navigate to the `backend` directory:
```bash
   cd backend
```
2. Create a virtual environment
```bash
   python -m venv .venv
```
3. Activate the virtual environment:
 - On Windows:
```powershell
   .venv\Scripts\activate
```
- On macOS/Linux:
```sh
   source venv/bin/activate
```
4. Install the required Python packages:
```bash
   pip install -r requirements.txt
```


### frontend

1. Navigate to the frontend directory

```bash
cd frontend
```
2. Install the required Node.js packages:

```bash
npm install
```
## Running the Project

### Backend
Ensure the virtual environment is activated.
Start the Flask server:
```bash
python app.py
```



### Frontend

```bash
cd frontend
npm run dev -- --open
```

## Building the Project
```bash
cd frontend
npm run build
# You can preview the production build with:
npm run preview
```

### Contributing
If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

### License

This project is licensed under the MIT License.
