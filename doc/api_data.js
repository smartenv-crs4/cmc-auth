define({ "api": [
  {
    "type": "post",
    "url": "/authapp/signup",
    "title": "Register a new Application",
    "version": "1.0.0",
    "name": "Create_Application",
    "group": "Application",
    "description": "<p>Accessible by Microservice access_token. It create a new Application object and return the access_credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "app",
            "description": "<p>the application dictionary with all the fields, only email, password and type are mandatory.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"email\": \"prova@prova.it\" , \"password\":\"provami\", \"type\":\"ext\", \"name\":\"nome\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>contains authapp Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>contains authapp refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>contains the id of app in authMS</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "  HTTP/1.1 201 CREATED\n\n {\n\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n    },\n    \"refreshToken\":{\n              \"token\":\"eQO7de4AJe-syk\",\n              \"expires\":1467394099074\n   },\n   \"userId\":\"4334f423432\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> username or password not valid.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>Not Logged ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    error:\"Unauthorized\",\n    error_description:\"Warning: wrong username\"\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/authapp/:id",
    "title": "delete Application in AuthMS",
    "version": "1.0.0",
    "name": "Delete_Application",
    "group": "Application",
    "description": "<p>Accessible only by microservice access_token, It delete Application and return the deleted resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "204 - NoContent": [
          {
            "group": "204 - NoContent",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_1",
            "description": "<p>Contains field 1 defined in Application Schema(example name)</p> "
          },
          {
            "group": "204 - NoContent",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_2",
            "description": "<p>Contains field 2 defined in Application Schema(example notes)</p> "
          },
          {
            "group": "204 - NoContent",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_N",
            "description": "<p>Contains field N defined in Application Schema(example type)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 204 DELETED\n\n{\n   \"name\":\"Micio\",\n   \"notes\":\"Macio\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authapp/:id/actions/disable",
    "title": "disable Application in AuthMs",
    "version": "1.0.0",
    "name": "DisableApplication",
    "group": "Application",
    "description": "<p>Accessible only by microservices access_token, It disable the Application.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>contains the new Application status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"status\":\"disabled\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authapp/:id/actions/enable",
    "title": "enable Application in AuthMs",
    "version": "1.0.0",
    "name": "EnableApplication",
    "group": "Application",
    "description": "<p>Accessible only by microservices access_token, It enable the Application.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>contains the new Application status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"status\":\"enabled\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authapp/:id",
    "title": "Get the Application un AuthMs by id",
    "version": "1.0.0",
    "name": "GetApplication",
    "group": "Application",
    "description": "<p>Accessible only by microservice access_token, it returns the info about Application in AuthMs microservice.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Application.id",
            "description": "<p>Application id identifier</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Application.field1",
            "description": "<p>field 1 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Application.field2",
            "description": "<p>field 2 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Application.fieldN",
            "description": "<p>field N defined in schema</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK, Success Response",
          "content": "\n{\n\n   \"_id\": \"543fdd60579e1281b8f6da92\",\n   \"email\": \"prova@prova.it\",\n   \"name\": \"prova\",\n   \"notes\": \"Notes About prova\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authapp/",
    "title": "Get all Applications in authMs",
    "version": "1.0.0",
    "name": "Get_Applications",
    "group": "Application",
    "description": "<p>Accessible only by microservice access_token, it returns the paginated list of all Applications. To set pagination skip and limit, you can do it in the URL request, for example &quot;get /authapp?skip=10&amp;limit=50&quot;</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ as query param || header]</p> "
          }
        ]
      }
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_metadata",
            "description": "<p>object containing metadata for pagination information</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Skips the first skip results of this Query</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this Query.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.totalCount",
            "description": "<p>Total number of query results.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>a paginated array list of users objects</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.id",
            "description": "<p>User id identifier</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.field1",
            "description": "<p>field 1 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.field2",
            "description": "<p>field 2 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.fieldN",
            "description": "<p>field N defined in schema</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK, Success Response",
          "content": "\n {\n   \"users\":[\n                  {\n                      \"_id\": \"543fdd60579e1281b8f6da92\",\n                      \"email\": \"prova@prova.it\",\n                       \"name\": \"prova\",\n                      \"notes\": \"Notes About prova\"\n                  },\n                  {\n                   \"id\": \"543fdd60579e1281sdaf6da92\",\n                      \"email\": \"prova1@prova.it\",\n                      \"name\": \"prova1\", *\n                      \"notes\": \"Notes About prova1\"\n\n                 },\n                ...\n             ],\n\n   \"_metadata\":{\n               \"skip\":10,\n               \"limit\":50,\n               \"totalCount\":100\n           }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authapp/signin",
    "title": "authapp login",
    "version": "1.0.0",
    "name": "Login_Application",
    "group": "Application",
    "description": "<p>Accessible only other microservice access_token. It login app and return the access_credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>the email</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"username\": \"prov@prova.it\" , \"password\":\"provami\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>contains authapp Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>contains authapp refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>contains the id of app in authMS</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "  HTTP/1.1 201 CREATED\n\n {\n\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n    },\n    \"refreshToken\":{\n              \"token\":\"eQO7de4AJe-syk\",\n              \"expires\":1467394099074\n   },\n   \"userId\":\"4334f423432\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> username or password not valid.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>Not Logged ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    error:\"Unauthorized\",\n    error_description:\"Warning: wrong username\"\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authapp/:id/actions/resetpassword",
    "title": "Reset Application password in AuthMs",
    "version": "1.0.0",
    "name": "ResetPassword",
    "group": "Application",
    "description": "<p>Accessible only by microservices access_token, It create a reset password Token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "reset_token",
            "description": "<p>Contains grant token to set the new password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"reset_token\":\"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6\", *\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authapp/:id/actions/setpassword",
    "title": "Set new Application password in AuthMs",
    "version": "1.0.0",
    "name": "SetPassword",
    "group": "Application",
    "description": "<p>Accessible only by microservices access_token, It update Application password.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application to identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>contains authapp Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>contains authapp refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>contains the id of app in authMS</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "  HTTP/1.1 201 CREATED\n\n {\n\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n    },\n    \"refreshToken\":{\n              \"token\":\"eQO7de4AJe-syk\",\n              \"expires\":1467394099074\n   },\n   \"userId\":\"4334f423432\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> username or password not valid.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>Not Logged ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    error:\"Unauthorized\",\n    error_description:\"Warning: wrong username\"\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "",
    "url": "Configuration",
    "title": "Fields",
    "version": "1.0.0",
    "name": "Configuration",
    "group": "Configuration",
    "description": "<p>This section describe configuration File</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dbPort",
            "description": "<p>Contains the mongoDb Port number</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dbHost",
            "description": "<p>Contains the mongoDb Host name</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dbName",
            "description": "<p>Contains the mongoDb database name</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Contains the default limit param used to paginate get response</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>Contains the default skip param used to paginate get response</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logfile",
            "description": "<p>where to save log information</p> "
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "userType",
            "description": "<p>Contains a list of Strings  User Type as inthe next example [&quot;admin&quot;,&quot;crocierista&quot; , &quot;ente&quot;, &quot;operatore&quot;]</p> "
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "appType",
            "description": "<p>Contains a list of Strings  application Type as inthe next example [&quot;webuiMS&quot;, &quot;ext&quot;, &quot;user&quot;,&quot;ms&quot;]</p> "
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "msType",
            "description": "<p>Contains a list of Strings  Microservices Type as inthe next example [&quot;AppService&quot; , &quot;UsersService&quot;, &quot;ContentsService&quot;,&quot;AuthMs&quot;,&quot;webuiMS&quot;]. Do not remove AuthMs that is this</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "MyMicroserviceToken",
            "description": "<p>String containig the token for this Auth microservice. if not specifed is autogeneratd from this AuthMs</p> "
          }
        ]
      }
    },
    "filename": "routes/middlewares.js",
    "groupTitle": "Configuration"
  },
  {
    "type": "get",
    "url": "/configMs/getMicroservices",
    "title": "Microservice List",
    "version": "1.0.0",
    "name": "Get_Microservices",
    "group": "Microservices",
    "description": "<p>Open a Microservice List WebPage</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>of microserviceType</p> "
          }
        ]
      }
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Microservices"
  },
  {
    "type": "get",
    "url": "/configMs",
    "title": "Microservice Registration",
    "version": "1.0.0",
    "name": "Get_Microservices",
    "group": "Microservices",
    "description": "<p>Open a SignUp Microservice WebPage</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_psw",
            "description": "<p>token of this AuthMs microservice</p> "
          }
        ]
      }
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Microservices"
  },
  {
    "type": "post",
    "url": "/refreshToken",
    "title": "Renew the token",
    "version": "1.0.0",
    "name": "Renew_Token",
    "group": "Token",
    "description": "<p>Accessible by Microservice access_token. It renew the token</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "refresh_token",
            "description": "<p>token used to renew the token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"refresh_token\": \"dsadasddfdf6g4fdgfh687gfhf\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>contains authapp Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>contains authapp refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>contains the id of app in authMS</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "  HTTP/1.1 201 CREATED\n\n {\n\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n    },\n    \"refreshToken\":{\n              \"token\":\"eQO7de4AJe-syk\",\n              \"expires\":1467394099074\n   },\n   \"userId\":\"4334f423432\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Token",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/decodeToken",
    "title": "Decode Token",
    "version": "1.0.0",
    "name": "Token_Decode",
    "group": "Token",
    "description": "<p>Accessible only by other microservice access_token. It decode the token and return the contents bundled in the token</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "decode_token",
            "description": "<p>token that should be unboxed</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "Boolean",
            "optional": false,
            "field": "valid",
            "description": "<p>if true the decoded token is valid and a token field is returned otherwise if false the decoded token is not valid and a error_message field is returned</p> "
          },
          {
            "group": "200 - OK",
            "type": "Boolean",
            "optional": false,
            "field": "token",
            "description": "<p>contains decoded token information only is valid field is true</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token._id",
            "description": "<p>contains id about token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.email",
            "description": "<p>contains email id about token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.type",
            "description": "<p>contains token owner type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.enabled",
            "description": "<p>if true the owner is enabled to access the resource</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "error_message",
            "description": "<p>is returned only if field valid is false, and contains error meesage that explain the decoded problem</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "  HTTP/1.1 200 Ok\n\n {\n\n    \"valid\":\"true\"\n    \"token\":{\n              \"_id\":\"eQO7de4AJe-syk\",\n              \"expires\":1467394099074,\n              \"email\":\"prova@prova.it\",\n              \"type\":\"webUI\",\n               \"enabled:true\n   }\n}",
          "type": "json"
        },
        {
          "title": "Example: 200 OK",
          "content": "  HTTP/1.1 200 Ok\n\n {\n\n    \"valid\":\"false\"\n    \"error_message\":\"token is expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Token",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/decodeToken",
    "title": "Decode Token with post",
    "version": "1.0.0",
    "name": "Token_Decode",
    "group": "Token",
    "description": "<p>Accessible only by other microservice access_token. It decode the token and return the contents bundled in the token</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "decode_token",
            "description": "<p>token that should be unboxed</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"decode_token\": \"34243243jkh4k32h4k3h43k4\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "Boolean",
            "optional": false,
            "field": "valid",
            "description": "<p>if true the decoded token is valid and a token field is returned otherwise if false the decoded token is not valid and a error_message field is returned</p> "
          },
          {
            "group": "200 - OK",
            "type": "Boolean",
            "optional": false,
            "field": "token",
            "description": "<p>contains decoded token information only is valid field is true</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token._id",
            "description": "<p>contains id about token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.email",
            "description": "<p>contains email id about token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.type",
            "description": "<p>contains token owner type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.enabled",
            "description": "<p>if true the owner is enabled to access the resource</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "error_message",
            "description": "<p>is returned only if field valid is false, and contains error meesage that explain the decoded problem</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "  HTTP/1.1 200 Ok\n\n {\n\n    \"valid\":\"true\"\n    \"token\":{\n              \"_id\":\"eQO7de4AJe-syk\",\n              \"expires\":1467394099074,\n              \"email\":\"prova@prova.it\",\n              \"type\":\"webUI\",\n               \"enabled:true\n   }\n}",
          "type": "json"
        },
        {
          "title": "Example: 200 OK",
          "content": "  HTTP/1.1 200 Ok\n\n {\n\n    \"valid\":\"false\"\n    \"error_message\":\"token is expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Token",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authuser/signup",
    "title": "Register a new User",
    "version": "1.0.0",
    "name": "Create_User",
    "group": "User",
    "description": "<p>Accessible by Microservice access_token. It create a new User object and return the access_credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>the User dictionary with all the fields, only email, password and type are mandatory.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"email\": \"prova@prova.it\" , \"password\":\"provami\", \"type\":\"ext\", \"name\":\"nome\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>contains authapp Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>contains authapp refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>contains the id of app in authMS</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "  HTTP/1.1 201 CREATED\n\n {\n\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n    },\n    \"refreshToken\":{\n              \"token\":\"eQO7de4AJe-syk\",\n              \"expires\":1467394099074\n   },\n   \"userId\":\"4334f423432\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/auth.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> username or password not valid.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>Not Logged ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    error:\"Unauthorized\",\n    error_description:\"Warning: wrong username\"\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/authuser/:id",
    "title": "delete User in AuthMS",
    "version": "1.0.0",
    "name": "Delete_User",
    "group": "User",
    "description": "<p>Accessible only by microservice access_token, It delete User and return the deleted resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the User</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "204 - NoContent": [
          {
            "group": "204 - NoContent",
            "type": "String",
            "optional": false,
            "field": "UserField_1",
            "description": "<p>Contains field 1 defined in User Schema(example name)</p> "
          },
          {
            "group": "204 - NoContent",
            "type": "String",
            "optional": false,
            "field": "UserField_2",
            "description": "<p>Contains field 2 defined in User Schema(example notes)</p> "
          },
          {
            "group": "204 - NoContent",
            "type": "String",
            "optional": false,
            "field": "UserField_N",
            "description": "<p>Contains field N defined in User Schema(example type)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 204 DELETED\n\n{\n   \"name\":\"Micio\",\n   \"notes\":\"Macio\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/auth.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authuser/:id/actions/disable",
    "title": "disable User in AuthMs",
    "version": "1.0.0",
    "name": "Disable_User",
    "group": "User",
    "description": "<p>Accessible only by microservices access_token, It disable the User.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the User</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>contains the new Application status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"status\":\"disabled\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/auth.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authuser/:id/actions/enable",
    "title": "enable User in AuthMs",
    "version": "1.0.0",
    "name": "Enable_User",
    "group": "User",
    "description": "<p>Accessible only by microservices access_token, It enable the User.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the User</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>contains the new User status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"status\":\"enabled\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/auth.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authuser/",
    "title": "Get all Applications in authMs",
    "version": "1.0.0",
    "name": "Get_User",
    "group": "User",
    "description": "<p>Accessible only by microservice access_token, it returns the paginated list of all Users. To set pagination skip and limit, you can do it in the URL request, for example &quot;get /authuser?skip=10&amp;limit=50&quot;</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ as query param || header]</p> "
          }
        ]
      }
    },
    "filename": "routes/auth.js",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_metadata",
            "description": "<p>object containing metadata for pagination information</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Skips the first skip results of this Query</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this Query.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.totalCount",
            "description": "<p>Total number of query results.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>a paginated array list of users objects</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.id",
            "description": "<p>User id identifier</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.field1",
            "description": "<p>field 1 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.field2",
            "description": "<p>field 2 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.fieldN",
            "description": "<p>field N defined in schema</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK, Success Response",
          "content": "\n {\n   \"users\":[\n                  {\n                      \"_id\": \"543fdd60579e1281b8f6da92\",\n                      \"email\": \"prova@prova.it\",\n                       \"name\": \"prova\",\n                      \"notes\": \"Notes About prova\"\n                  },\n                  {\n                   \"id\": \"543fdd60579e1281sdaf6da92\",\n                      \"email\": \"prova1@prova.it\",\n                      \"name\": \"prova1\", *\n                      \"notes\": \"Notes About prova1\"\n\n                 },\n                ...\n             ],\n\n   \"_metadata\":{\n               \"skip\":10,\n               \"limit\":50,\n               \"totalCount\":100\n           }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authuser/:id",
    "title": "Get the User in AuthMs by id",
    "version": "1.0.0",
    "name": "Get_User",
    "group": "User",
    "description": "<p>Accessible only by microservice access_token, it returns the info about Application in AuthMs microservice.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.id",
            "description": "<p>Application id identifier</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.field1",
            "description": "<p>field 1 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.field2",
            "description": "<p>field 2 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.fieldN",
            "description": "<p>field N defined in schema</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK, Success Response",
          "content": "\n{\n\n   \"_id\": \"543fdd60579e1281b8f6da92\",\n   \"email\": \"prova@prova.it\",\n   \"name\": \"prova\",\n   \"notes\": \"Notes About prova\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/auth.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authuser/signin",
    "title": "User login in AuthMS",
    "version": "1.0.0",
    "name": "Login_User",
    "group": "User",
    "description": "<p>Accessible only by other microservice access_token. It login User and return the access_credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>the email</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"username\": \"prov@prova.it\" , \"password\":\"provami\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>contains authapp Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>contains authapp refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>contains the id of app in authMS</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "  HTTP/1.1 201 CREATED\n\n {\n\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n    },\n    \"refreshToken\":{\n              \"token\":\"eQO7de4AJe-syk\",\n              \"expires\":1467394099074\n   },\n   \"userId\":\"4334f423432\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/auth.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> username or password not valid.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>Not Logged ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    error:\"Unauthorized\",\n    error_description:\"Warning: wrong username\"\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authuser/:id/actions/resetpassword",
    "title": "Reset User password in AuthMs",
    "version": "1.0.0",
    "name": "ResetPassword",
    "group": "User",
    "description": "<p>Accessible only by microservices access_token, It create a reset password Token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the User</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "reset_token",
            "description": "<p>Contains grant token to set the new password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"reset_token\":\"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6\", *\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/auth.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authuser/:id/actions/setpassword",
    "title": "Set new User password in AuthMs",
    "version": "1.0.0",
    "name": "SetPassword",
    "group": "User",
    "description": "<p>Accessible only by microservices access_token, It update User password.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application to identify the User</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>contains User Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>contains authapp refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>contains the id of User in authMS</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "  HTTP/1.1 201 CREATED\n\n {\n\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n    },\n    \"refreshToken\":{\n              \"token\":\"eQO7de4AJe-syk\",\n              \"expires\":1467394099074\n   },\n   \"userId\":\"4334f423432\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/auth.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> username or password not valid.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>Not Logged ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    error:\"Unauthorized\",\n    error_description:\"Warning: wrong username\"\n }",
          "type": "json"
        }
      ]
    }
  }
] });