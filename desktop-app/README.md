# Boomerang Desktop File Encryptor 


## Running the Python App

1. Clone the repository to your local machine
2. Open a terminal and navigate to the root of the project
3. Install the required dependencies by running the following command:
```
pip install -r requirements.txt
```
4. Run either the encrytor or decryptor by going into the `boomerang-app` folder and running 
```
python encrypt.py 
```
or 
```
python decrypt.py 
```
## Packaging the app

1. Run the command 

```
pyinstaller --onefile --windowed  app.py
```
this will create an exe an app file in the dist directory that you can double click to launch 

