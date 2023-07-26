# Thyone Extension

Thyone is a collaborative extension for the classic Jupyter Notebook developed by the PET Lab at the University of Lausanne. This extension is a research artifact built for a project aimed at supporting collaboration in programming learning for novices. The research has been published in CSCW 2023, and the paper can be found [here](https://doi.org/10.1145/3610089).
This extension has two main features : 
(i) Enables users to plan their problem-solving process by creating flowcharts. 
(ii) Facilitates random pairing of users logged in Jupyterhub, allowing them to chat with each other, share text messages, and exchange code and output cells for collaborative programming and learning.

 
## Frontend Code

This repository contains the frontend code for the Thyone extension. The code is compatible with version 6.0.3 of Jupyter Notebook. Please note that it has not been tested with any version after 6.2.0. Additionally, please be aware that this extension is not supported in JupyterLab.

Before setting up the frontend code for the Thyone extension, it is essential to configure and run the [Thyone Backend Code](https://github.com/petlab-unil/thyone-extension-backend). The successful functioning of the extension relies on communication with the backend. Therefore, please ensure that you have set up and started the backend code before proceeding with the frontend setup.

## Entrypoint

The entry point in the frontend code is in the function `initExtension` in `src/hec.js`

## Example of .env 

```
BACKEND_WS = ws://localhost:3000
BACKEND_HTTP = http://localhost:3000
HUB_PATH = http://localhost:8000/hub/api 
```

## Installation

To install the Thyone extension in your local environment, follow these steps:

1. Ensure you have Jupyter Notebooks (between v6.0.3 and v6.2.0) installed.

2. Install `jupyter_contrib_nbextensions`. Detailed installation guide can be found [here](https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/install.html).

   - Install the python package for `jupyter_contrib_extensions`:
   
     ```
     $ pip install jupyter_contrib_nbextensions
     ```
   
   - Install Javascript and CSS files for `jupyter_contrib_extensions`:
   
     ```
     $ jupyter contrib nbextension install --user
     ```

3. Install Jupyterhub (<= v2.2.0) as root:

   ```        
   $ sudo sh
   $ python3 -m pip install jupyterhub        
   ```
   
   If a proxy error is encountered, run:
   
   ```  
   $ npm install -g configurable-http-proxy
   ```          

4. Clone this git repo:

   ```
   $ git clone git@github.com:petlab-unil/thyone-extension-frontend.git
   ```

5. Install dependencies:

   ```
   $ npm i
   ```

6. Run the extension:

   ```
   $ npm run build
   ```

## Using Thyone Extension in Your Local Environment

7. Please make sure that the [Thyone Backend code](https://github.com/petlab-unil/thyone-extension-backend) is running on your local environment. If the backend code is not running, the frontend code of the extension will build successfully, but the extension will not appear on the interface. To troubleshoot any issues, check the browser console for error messages.

8. Run Jupyterhub as root and open a Jupyter Notebook instance. 

   - Open a new terminal and start Jupyterhub from root:
   
     ``` 
     $ sudo sh
     $ jupyterhub
     ```
     
   - In the browser, go to http://localhost:8000/hub (Do not go to port 8081 because the proxy will not work). Then open any notebook or create a new one (Python 3 ipykernel). 
   - If you want to test the chat, simply log into running instance of jupyterhub with another user account in a new browser window.

## Citation
If you use this in your research please consider citing:

*Lahari Goswami, Alexandre Senges, Thibault Estier, and Mauro Cherubini. 2023. Supporting Co-Regulation and Motivation in Learning Programming in Online Classrooms. Proc. ACM Hum.-Comput. Interact. 7, CSCW2, Article 298 (October 2023), 29 pages. https://doi.org/10.1145/3610089*
