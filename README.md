# CMC Auth Microservice
CMC Auth is the authentication and authorisation microservice of the CMC (Crs4 Microservice Core) framework.
It takes care of managing all tokens that enable authentication and authorisation among microservices, to consuming users
and to third party applications. <br>
For API reference, see the service auto-generated online documentation at <code>http://service_base_url/doc</code>.

## Usage

### Install

#### 1) Install Mocha (for testing):

    sudo npm install -g mocha

#### 2) Install apiDoc (for API documentation):

    sudo npm install -g apidoc

#### 3) Install all dependencies
    
    npm install


### Run test suite

    npm test
    

### Generate API documentation

    apidoc -i ./routes -o apidoc
    

### Run the application

#### For *development* mode, run:

    NODE_ENV=dev npm start

#### For *production* mode, run:

    npm start
    
The backoffice where you can manage microservice authorisations can be found at
<code>http://service_base_url/configure</code><br><br>
Just log in using admin credentials:
* username -> admin@admin.com
* password -> admin

AdminDefaultUser can be changed in default.json config file