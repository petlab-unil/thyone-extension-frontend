# hec-jupyter-extension

# Entrypoint

The entry point is in the function `initExtension` in `src/hec.js`

# Install

## Clone repo

    git clone git@github.com:sakex/hec-jupyter-extension.git && cd hec-jupyter-extension

## Install dependencies

    npm i

## Jupyter Notebook

    pip install jupyterlab

## Jupyter Contrib extensions

- Install jupyter contrib extensions:

        pip install jupyter_contrib_nbextensions

- Install JS and CSS:

        jupyter contrib nbextension install --user

- install jupyterhub as root
        
        sudo sh
  
        python3 -m pip install jupyterhub        

    if proxy error:

        npm install -g configurable-http-proxy

# Launch Jupyter

    jupyter notebook

# Test your code in Jupyter

    npm run build

- Reload the Notebook to see the changes

# run jupyterhub

- in terminal:
  
      sudo sh

      jupyterhub

- in navigator ( do not go at 8081 because proxy will not work ):

  http://localhost:8000/hub

then open any notebook or create a new one (Python 3 ipykernel)

if you want to test the chat then simply log in with an other user account in a new window

## .env

    BACKEND_WS = ws://localhost:3000
    BACKEND_HTTP = http://localhost:3000
    HUB_PATH = http://localhost:8000/hub/api
