#CaPort2020 User Microservice Development
private use only

##Installing

###1) Install Mocha (for testing):

    sudo npm install -g mocha

###2) Install apiDoc (for API docs):

    sudo npm install -g apidoc

###3) Install all dependencies
    
    npm install


##Running Tests

    npm test
    

##Generating API documentation

    apidoc -i ./routes -o apidoc


##Running Application

In *development* mode, run:

    NODE_ENV=dev npm start

In production mode, run:

    npm start
