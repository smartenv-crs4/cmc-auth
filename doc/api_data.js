define({ "api": [
  {
    "type": "get",
    "url": "/apptypes",
    "title": "Get all application types",
    "version": "1.0.0",
    "name": "Application_type_list",
    "group": "AppType",
    "description": "<p>Accessible only by microservice access tokens. Returns a paginated list of all available application types.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          }
        ]
      }
    },
    "filename": "routes/appTypes.js",
    "groupTitle": "AppType",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_metadata",
            "description": "<p>Object containing metadata for pagination info</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Number of results of this query skipped</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this query.</p> "
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
          "content": "{\n  \"users\":[\n                 {\n                     \"_id\": \"543fdd60579e1281b8f6da92\",\n                     \"email\": \"prova@prova.it\",\n                     \"name\": \"prova\",\n                     \"notes\": \"Notes About prova\"\n                 },\n                 {\n                  \"id\": \"543fdd60579e1281sdaf6da92\",\n                     \"email\": \"prova1@prova.it\",\n                     \"name\": \"prova1\", *\n                     \"notes\": \"Notes About prova1\"\n\n                },\n               ...\n            ],\n\n  \"_metadata\":{\n              \"skip\":10,\n              \"limit\":50,\n              \"totalCount\":100\n              }\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/apptypes",
    "title": "Create a new application type",
    "version": "1.0.0",
    "name": "Create_new_application_type",
    "group": "AppType",
    "description": "<p>Accessible only by microservice access tokens. Creates a new Application type and returns the created resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "apptype",
            "description": "<p>the application type dictionary with all the fields. Name is mandatory.</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "apptype.name",
            "description": "<p>the application type name</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"apptype\": {\"name\":\"ExternalWebUi\"}}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - CREATED": [
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the created application type</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>name the of created application type</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>type of the created application type. Must be equal to &quot;app&quot;</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "HTTP/1.1 201 CREATED\n{\n  \"_id\":\"9804H4334HFN\",\n  \"name\":\"ExternaWebUi\",\n  \"type\":\"app\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/appTypes.js",
    "groupTitle": "AppType",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/apptypes/:id",
    "title": "delete application type",
    "version": "1.0.0",
    "name": "Delete_Application_Type",
    "group": "AppType",
    "description": "<p>Accessible only by microservice access tokens. Deletes Application type and returns the deleted resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application type id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Application type identifier</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Application type name</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\":\"543fdd60579e1281b8f6da92\",\n  \"name\":\"externalWebUi\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/appTypes.js",
    "groupTitle": "AppType",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "409_Conflict",
            "description": "<p><b>Conflict:</b> Indicates that the request could not be processed because of conflict in the request. For Example a resource could not be deleted because is used from other resource <b>request.body.error</b> contains an error name specifing the Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the conflict.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/apptypes/:id",
    "title": "Get application type by Id",
    "version": "1.0.0",
    "name": "Get_Application_type_info",
    "group": "AppType",
    "description": "<p>Accessible only by microservice access tokens. Given an Id, it returns the application type info.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application type id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Application type identifier</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Application type name</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK, Success Response",
          "content": "{\n   \"_id\": \"543fdd60579e1281b8f6da92\",\n   \"name\": \"externalWebUi\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/appTypes.js",
    "groupTitle": "AppType",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/apptypes/:id",
    "title": "update application type info",
    "version": "1.0.0",
    "name": "Update_application",
    "group": "AppType",
    "description": "<p>Accessible only by microservice access tokens. Updates the Application type info and returns the updated resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Application type id</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "apptype",
            "description": "<p>Application type dictionary with all the fields to update.</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "apptype.name",
            "description": "<p>Application type name</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 PUT request\n Body:{ \"apptype\": {\"name\":\"ExternalWebUi\"}}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the updated application type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>name of the updated application type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>type of the updated application type. Must be equal to &quot;app&quot;</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\":\"9804H4334HFN\",\n  \"name\":\"ExternaWebUi\",\n  \"type\":\"app\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/appTypes.js",
    "groupTitle": "AppType",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "409_Conflict",
            "description": "<p><b>Conflict:</b> Indicates that the request could not be processed because of conflict in the request. For Example a resource could not be deleted because is used from other resource <b>request.body.error</b> contains an error name specifing the Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the conflict.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authapp/signup",
    "title": "Register a new Application",
    "version": "1.0.0",
    "name": "Create_Application",
    "group": "Application",
    "description": "<p>Accessible by microservice access tokens. Creates a new Application object and returns the access credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "app",
            "description": "<p>the application dictionary with all the fields. Only email, password and type are mandatory.</p> "
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
        "201 - CREATED": [
          {
            "group": "201 - CREATED",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>application Token</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>application refreshToken</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>refreshToken expiration date</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>application id</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "  HTTP/1.1 201 CREATED\n  {\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n             },\n    \"refreshToken\":{\n                      \"token\":\"eQO7de4AJe-syk\",\n                      \"expires\":1467394099074\n                   },\n   \"userId\":\"4334f423432\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p>Username or password not valid.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>Not Logged ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    \"error\":\"Unauthorized\",\n    \"error_description\":\"Warning: wrong username\"\n }",
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
    "description": "<p>Accessible only by microservice access tokens. Deletes the Application and returns the deleted resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_1",
            "description": "<p>field 1 defined in Application Schema (e.g. name)</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_2",
            "description": "<p>field 2 defined in Application Schema (e.g. notes)</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_N",
            "description": "<p>field N defined in Application Schema (e.g. type)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": " HTTP/1.1 200 OK\n{\n   \"name\":\"Micio\",\n   \"notes\":\"Macio\",\n }",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
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
    "description": "<p>Accessible only by microservice access tokens. Denies access to the Application.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
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
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>the new Application status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\":\"disabled\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
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
    "description": "<p>Accessible only by microservice access tokend. Grants access to the Application.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>contains the new Application status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\":\"enabled\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authapp/:id",
    "title": "Get the Application in AuthMs by id",
    "version": "1.0.0",
    "name": "GetApplication",
    "group": "Application",
    "description": "<p>Accessible only by microservice access tokens. Returns the info about Application in AuthMs microservice.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id</p> "
          }
        ]
      }
    },
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
          "content": "{\n   \"_id\": \"543fdd60579e1281b8f6da92\",\n   \"email\": \"prova@prova.it\",\n   \"name\": \"prova\",\n   \"notes\": \"Notes About prova\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
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
    "description": "<p>Accessible only by microservice access tokens. Returns the paginated list of all Applications. Set pagination skip and limit in the URL request, e.g. &quot;get /authapp?skip=10&amp;limit=50&quot;</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
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
            "description": "<p>Object containing metadata for pagination info</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Number of results of this query skipped</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this query.</p> "
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
          "content": "{\n  \"users\":[\n                 {\n                     \"_id\": \"543fdd60579e1281b8f6da92\",\n                     \"email\": \"prova@prova.it\",\n                     \"name\": \"prova\",\n                     \"notes\": \"Notes About prova\"\n                 },\n                 {\n                  \"id\": \"543fdd60579e1281sdaf6da92\",\n                     \"email\": \"prova1@prova.it\",\n                     \"name\": \"prova1\", *\n                     \"notes\": \"Notes About prova1\"\n\n                },\n               ...\n            ],\n\n  \"_metadata\":{\n              \"skip\":10,\n              \"limit\":50,\n              \"totalCount\":100\n              }\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
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
    "description": "<p>Accessible only microservice access_tokens. Logs in the app and returns the access credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
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
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>application Token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>application refreshToken</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>refreshToken expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>application id</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "  HTTP/1.1 200 OK\n  {\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n             },\n    \"refreshToken\":{\n                      \"token\":\"eQO7de4AJe-syk\",\n                      \"expires\":1467394099074\n                   },\n   \"userId\":\"4334f423432\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p>Username or password not valid.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>Not Logged ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    \"error\":\"Unauthorized\",\n    \"error_description\":\"Warning: wrong username\"\n }",
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
    "description": "<p>Accessible only by microservice access tokens. Creates a reset password token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "reset_token",
            "description": "<p>the grant token to set the new password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"reset_token\":\"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6\", *\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
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
    "description": "<p>Accessible only by microservice access_token. Updates the Application password.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>application Token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>application refreshToken</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>refreshToken expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>application id</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"apiKey\":{\n            \"token\":\"VppR5sHU_hV3U\",\n            \"expires\":1466789299072\n           },\n  \"refreshToken\":{\n                    \"token\":\"eQO7de4AJe-syk\",\n                    \"expires\":1467394099074\n                 },\n \"userId\":\"4334f423432\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p>Username or password not valid.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>Not Logged ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    \"error\":\"Unauthorized\",\n    \"error_description\":\"Warning: wrong username\"\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authms/renewtoken",
    "title": "Renew Token",
    "version": "1.0.0",
    "name": "Create_a_new_Token_for_a_Microservice_type",
    "group": "Authms",
    "description": "<p>Accessible only by microservice access tokens. Creates a new Acess token for a given microservice type.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "serviceType",
            "description": "<p>the name of the microservice on wich create access_token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"serviceType\": \"userms\" }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - OK": [
          {
            "group": "201 - OK",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The microservice access_token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 Ok",
          "content": "HTTP/1.1 201 CREATED\n{\n  \"token\":\"9804H4334HFN......\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Authms",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authms/authendpoint",
    "title": "Create a new authorization rule",
    "version": "1.0.0",
    "name": "Create_a_new_authorization_rule",
    "group": "Authms",
    "description": "<p>Accessible only by microservice access tokens. Creates a new authorization rule and returns it.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the name of the microservice whose access is managed by the rule</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body.microservice",
            "description": "<p>the microservice role dictionary. URI, authToken and method are mandatory fields.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.microservice.URI",
            "description": "<p>URI of resource whose access is managed by the rule</p> "
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "body.microservice.authToken",
            "description": "<p>a list of token types allowed to access this resource managed by the rule</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.microservice.method",
            "description": "<p>HTTP method (GET, POST, PUT, DELETE) that can be set to specialize the rule</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"microservice\": {\n              \"URI\":\"/users\",\n              \"authToken\":[\"WebUI\", \"UserMS\"],\n              \"method\":\"POST\",\n              \"name\":\"authms\"\n             }\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - OK": [
          {
            "group": "201 - OK",
            "type": "String",
            "optional": false,
            "field": "URI",
            "description": "<p>URI of the resource</p> "
          },
          {
            "group": "201 - OK",
            "type": "String[]",
            "optional": false,
            "field": "authToken",
            "description": "<p>list of token types allowed to access the resource</p> "
          },
          {
            "group": "201 - OK",
            "type": "String",
            "optional": false,
            "field": "method",
            "description": "<p>HTTP method (GET, POST, PUT, DELETE) that can be set to specialize the rule</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 Ok",
          "content": "HTTP/1.1 201 CREATED\n{\n  \"_id\":\"9804H4334HFN......\",\n  \"URI\":\"/users......\",\n  \"method\":\"POST\",\n  \"name\":\"authms\",\n  \"authToken\":[\"WebUI\", \"UserMS\"]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Authms",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authms/signup",
    "title": "Create aand save new microservice",
    "version": "1.0.0",
    "name": "Create_and_save_a_new_Microservice_type",
    "group": "Authms",
    "description": "<p>Accessible only by microservice access tokens. Creates a new microservice type.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the name of the microservice to create</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "baseUrl",
            "description": "<p>the microservice gateway/loadbalance base url</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>the color used in the UI to represent the microservice</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "icon",
            "description": "<p>the icon used in the UI to represent the microservice</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"name\": \"userms\",\n       \"baseUrl\":\"localhost:3000/nginx\",\n       \"color\":\"yellow\",\n       \"icon\":\"fa-users\"\n      }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - OK": [
          {
            "group": "201 - OK",
            "type": "Object",
            "optional": false,
            "field": "The",
            "description": "<p>created resource</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 Ok",
          "content": "HTTP/1.1 201 CREATED\n{\n  \"name\":\"userms\",\n  \"baseUrl\":\"localhost:3000/nginx\",\n  \"color\":\"yellow\",\n  \"icon\":\"fa-users\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Authms",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/authms/authendpoint/:id",
    "title": "Delete authorization rule by Id",
    "version": "1.0.0",
    "name": "DeleteAuthRulesById",
    "group": "Authms",
    "description": "<p>Accessible only by microservice access_token, it delete an authorization rule by id.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>authorization rule id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "204 - NO CONTENT": [
          {
            "group": "204 - NO CONTENT",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>rule identifier</p> "
          },
          {
            "group": "204 - NO CONTENT",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the name of the microservice whose access is managed by the rule</p> "
          },
          {
            "group": "204 - NO CONTENT",
            "type": "String",
            "optional": false,
            "field": "URI",
            "description": "<p>URI of the resource whose access is managed by the rule</p> "
          },
          {
            "group": "204 - NO CONTENT",
            "type": "String",
            "optional": false,
            "field": "method",
            "description": "<p>HTTP method (GET, POST, PUT, DELETE) that could have been set to specialize the rule</p> "
          },
          {
            "group": "204 - NO CONTENT",
            "type": "String[]",
            "optional": false,
            "field": "authToken",
            "description": "<p>a list of token types allowed to access the resource</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 204 NO CONTENT",
          "content": "HTTP/1.1 204 NO CONTENT\n   {\n      \"_id\": \"543fdd60579e1281b8f6da92\",\n      \"name\": \"authMS\",\n      \"URI\": \"/users\",\n      \"method\":\"GET\",\n      \"authToken\":[\"WebUI\", \"externalApp\", \"UserMS\"]\n   }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Authms",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/authms/:id",
    "title": "",
    "version": "1.0.0",
    "name": "Delete_a_microservice",
    "group": "Authms",
    "description": "<p>Accessible only by microservice access tokens. Deletes a microservice type.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>(url param) id the microservice id to delete</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - OK": [
          {
            "group": "201 - OK",
            "type": "Object",
            "optional": false,
            "field": "The",
            "description": "<p>deleted resource</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 Ok",
          "content": "HTTP/1.1 200 Deleted\n{\n  \"name\":\"userms\",\n  \"baseUrl\":\"localhost:3000/nginx\",\n  \"color\":\"yellow\",\n  \"icon\":\"fa-users\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Authms",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authms/authendpoint",
    "title": "Get all authorization rules",
    "version": "1.0.0",
    "name": "GetAuthRules",
    "group": "Authms",
    "description": "<p>Accessible only by microservice access tokens. Returns the paginated list of all endpoint rules. Set pagination skip and limit in the URL request, e.g. &quot;get /authms/authendpoint?skip=10&amp;limit=50&quot;</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>pagination skip param</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>pagination limit param</p> "
          }
        ]
      }
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Authms",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_metadata",
            "description": "<p>Object containing metadata for pagination info</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Number of results of this query skipped</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this query.</p> "
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
          "content": "{\n  \"users\":[\n                 {\n                     \"_id\": \"543fdd60579e1281b8f6da92\",\n                     \"email\": \"prova@prova.it\",\n                     \"name\": \"prova\",\n                     \"notes\": \"Notes About prova\"\n                 },\n                 {\n                  \"id\": \"543fdd60579e1281sdaf6da92\",\n                     \"email\": \"prova1@prova.it\",\n                     \"name\": \"prova1\", *\n                     \"notes\": \"Notes About prova1\"\n\n                },\n               ...\n            ],\n\n  \"_metadata\":{\n              \"skip\":10,\n              \"limit\":50,\n              \"totalCount\":100\n              }\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authms/authendpoint/:id",
    "title": "Get authorization rule by Id",
    "version": "1.0.0",
    "name": "GetAuthRulesById",
    "group": "Authms",
    "description": "<p>Accessible only by microservice access_token, it returns an authorization rule by id.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>authorization rule id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>rule identifier</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the name of the microservice whose access is managed by the rule</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "URI",
            "description": "<p>URI of resource whose access is managed by the rule</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "method",
            "description": "<p>HTTP method (GET, POST, PUT, DELETE) that can be set to specialize the rule</p> "
          },
          {
            "group": "200 - OK",
            "type": "String[]",
            "optional": false,
            "field": "authToken",
            "description": "<p>list of token types allowed to access the resource</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n   {\n      \"_id\": \"543fdd60579e1281b8f6da92\",\n      \"name\": \"authMS\",\n      \"URI\": \"/users\",\n      \"method\":\"GET\",\n      \"authToken\":[\"WebUI\", \"externalApp\", \"UserMS\"]\n   }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Authms",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authms/authendpoint:/name",
    "title": "Get authorization rules of a given microservice",
    "version": "1.0.0",
    "name": "GetMicroserviceAuthRules",
    "group": "Authms",
    "description": "<p>Accessible only by microservice access tokens. Returns the paginated list of all endpoint rules of a given microservice. Set pagination skip and limit in the URL request, e.g. &quot;get /authms/authendpoint?skip=10&amp;limit=50&quot;</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the name of the microservice</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>pagination skip param</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "limit",
            "description": "<p>pagination limit param</p> "
          }
        ]
      }
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Authms",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_metadata",
            "description": "<p>Object containing metadata for pagination info</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Number of results of this query skipped</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this query.</p> "
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
          "content": "{\n  \"users\":[\n                 {\n                     \"_id\": \"543fdd60579e1281b8f6da92\",\n                     \"email\": \"prova@prova.it\",\n                     \"name\": \"prova\",\n                     \"notes\": \"Notes About prova\"\n                 },\n                 {\n                  \"id\": \"543fdd60579e1281sdaf6da92\",\n                     \"email\": \"prova1@prova.it\",\n                     \"name\": \"prova1\", *\n                     \"notes\": \"Notes About prova1\"\n\n                },\n               ...\n            ],\n\n  \"_metadata\":{\n              \"skip\":10,\n              \"limit\":50,\n              \"totalCount\":100\n              }\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/authms/authendpoint/:id",
    "title": "Update authorization rule by Id",
    "version": "1.0.0",
    "name": "UpdateAuthRulesById",
    "group": "Authms",
    "description": "<p>Accessible only by microservice access tokens. Updates an authorization rule by id.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>rule identifier</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body.microservice",
            "description": "<p>the microservice role dictionary with updatable fields defined below</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.microservice.URI",
            "description": "<p>URI of the resource whose access is managed by the rule</p> "
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "body.microservice.authToken",
            "description": "<p>a list of token types enabled to access to this resource that are subject of the rule.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.microservice.method",
            "description": "<p>HTTP method (GET, POST, PUT, DELETE) that could have been set to specialize the rule</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"microservice\": {\n              \"name\":\"AuthMs\",\n              \"URI\":\"/users\",\n              \"authToken\":[\"WebUI\", \"UserMS\"],\n              \"method\":\"POST\"\n             }\n      }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>resource access rule id identifier</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>name of microservice which has set the rule.</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "URI",
            "description": "<p>URI of resource on which has set the rule.</p> "
          },
          {
            "group": "200 - OK",
            "type": "String[]",
            "optional": false,
            "field": "authToken",
            "description": "<p>list of token types allowed to access the resource</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "method",
            "description": "<p>HTTP method (GET, POST, PUT, DELETE) that could have been set to specialize the rule</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n   {\n      \"_id\": \"543fdd60579e1281b8f6da92\",\n      \"name\": \"authMS\",\n      \"URI\": \"/users\",\n      \"method\":\"GET\",\n      \"authToken\":[\"WebUI\", \"externalApp\", \"UserMS\"]\n   }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/microserviceReg.js",
    "groupTitle": "Authms",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
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
    "description": "<p>This section lists the configuration parameters of the microservice</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dbPort",
            "description": "<p>mongoDb Port number</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dbHost",
            "description": "<p>mongoDb Host name</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dbName",
            "description": "<p>mongoDb database name</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>default limit param used to paginate get response</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>default skip param used to paginate get response</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logfile",
            "description": "<p>log file path</p> "
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "userType",
            "description": "<p>dictionary of User types, e.g. [&quot;admin&quot;,&quot;crocierista&quot; , &quot;ente&quot;, &quot;operatore&quot;]</p> "
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "appType",
            "description": "<p>dictionary of Application types, e.g. [&quot;webuiMS&quot;, &quot;ext&quot;, &quot;user&quot;,&quot;ms&quot;]</p> "
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "msType",
            "description": "<p>dictionary of Microservice types, e.g. [&quot;AppService&quot; , &quot;UsersService&quot;, &quot;ContentsService&quot;,&quot;AuthMs&quot;,&quot;webuiMS&quot;]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "MyMicroserviceToken",
            "description": "<p>the token for this microservice. Autogenerated if not set</p> "
          }
        ]
      }
    },
    "filename": "routes/middlewares.js",
    "groupTitle": "Configuration"
  },
  {
    "type": "get",
    "url": "/actions/gettokentypelist",
    "title": "Decode Token and check authorizations",
    "version": "1.0.0",
    "name": "Get_All_Token_Type_List",
    "group": "Token",
    "description": "<p>Accessible only by microservice access tokens. Gets a list of valid token types.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String[]",
            "optional": false,
            "field": "user",
            "description": "<p>a list of valid and available users tokens</p> "
          },
          {
            "group": "200 - OK",
            "type": "String[]",
            "optional": false,
            "field": "app",
            "description": "<p>a list of valid and available application tokens</p> "
          },
          {
            "group": "200 - OK",
            "type": "String[]",
            "optional": false,
            "field": "ms",
            "description": "<p>a list of valid and available microservice tokens</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 Ok\n{\n  \"user\":[ \"userTypeOne\" , \"userTypeTwo\" .....],\n  \"app\":[ \"appTypeOne\" , \"appTypeTwo\" .....],\n  \"ms\":[ \"msTypeOne\" , \"msTypeTwo\" .....]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/actions.js",
    "groupTitle": "Token",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/actions/getsupeusertokenlist",
    "title": "Return admin user list",
    "version": "1.0.0",
    "name": "Get_All_admin_Token_Type_List",
    "group": "Token",
    "description": "<p>Accessible only by microservice access tokens. Gets a list of valid admin token types.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String[]",
            "optional": false,
            "field": "superuser",
            "description": "<p>a list of valid and available admin user tokens</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n    \"superuser\":[ \"userTypeOne\" , \"userTypeTwo\" .....]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/actions.js",
    "groupTitle": "Token",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/actions/getsuperapptokenlist",
    "title": "Return special app list",
    "version": "1.0.0",
    "name": "Get_All_special_app_Token_Type_List",
    "group": "Token",
    "description": "<p>Accessible only by microservice access tokens. Gets a list of valid super app token types.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String[]",
            "optional": false,
            "field": "superapp",
            "description": "<p>a list of valid and available admin app tokens</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 Ok\n{\n    \"superapp\":[ \"appTypeOne\" , \"appTypeTwo\" .....]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/actions.js",
    "groupTitle": "Token",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/actions/refreshToken",
    "title": "Renew the token",
    "version": "1.0.0",
    "name": "Renew_Token",
    "group": "Token",
    "description": "<p>Accessible by microservice access tokens. Renews the token</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
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
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>consumer token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew a token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>authapp refreshToken</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>refreshToken expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>consumer id</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"apiKey\":{\n            \"token\":\"VppR5sHU_hV3U\",\n            \"expires\":1466789299072\n           },\n  \"refreshToken\":{\n                  \"token\":\"eQO7de4AJe-syk\",\n                  \"expires\":1467394099074\n                 },\n  \"userId\":\"4334f423432\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/actions.js",
    "groupTitle": "Token",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/actions/decodeToken",
    "title": "Decode Token with post",
    "version": "1.0.0",
    "name": "Token_Decode",
    "group": "Token",
    "description": "<p>Accessible only by microservice access tokens. Decodes the token and return the contents bundled in the token</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "decode_token",
            "description": "<p>token to be unboxed</p> "
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
            "description": "<p>if true, the decoded token is valid and a token field is returned. If false, the decoded token is not valid and an error_message field is returned</p> "
          },
          {
            "group": "200 - OK",
            "type": "Boolean",
            "optional": false,
            "field": "token",
            "description": "<p>decoded token information - returned only if valid field is true</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token._id",
            "description": "<p>id of the token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.email",
            "description": "<p>email address of the token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.type",
            "description": "<p>token owner type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.enabled",
            "description": "<p>if true, the owner is allowed to access the resource</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "error_message",
            "description": "<p>error message explaining the problem in decoding the token - returned only if field &quot;valid&quot; is false</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"valid\":\"true\"\n  \"token\":{\n            \"_id\":\"eQO7de4AJe-syk\",\n            \"expires\":1467394099074,\n            \"email\":\"prova@prova.it\",\n            \"type\":\"webUI\",\n            \"enabled:true\n          }\n}",
          "type": "json"
        },
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"valid\":\"false\"\n  \"error_message\":\"token is expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/actions.js",
    "groupTitle": "Token",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/actions/decodeToken",
    "title": "Decode Token",
    "version": "1.0.0",
    "name": "Token_Decode",
    "group": "Token",
    "description": "<p>Accessible only by microservice access tokens. Decodes the token and returns the contents bundled in the token</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "decode_token",
            "description": "<p>token to be unboxed</p> "
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
            "description": "<p>if true, the decoded token is valid and a token field is returned. If false, the decoded token is not valid and an error_message field is returned</p> "
          },
          {
            "group": "200 - OK",
            "type": "Boolean",
            "optional": false,
            "field": "token",
            "description": "<p>decoded token information - returned only if valid field is true</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token._id",
            "description": "<p>id of the token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.email",
            "description": "<p>email address of the token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.type",
            "description": "<p>token owner type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.enabled",
            "description": "<p>if true, the owner is allowed to access the resource</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "error_message",
            "description": "<p>error message explaining the problem in decoding the token - returned only if field &quot;valid&quot; is false</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 Ok\n{\n  \"valid\":\"true\"\n  \"token\":{\n            \"_id\":\"eQO7de4AJe-syk\",\n            \"expires\":1467394099074,\n            \"email\":\"prova@prova.it\",\n            \"type\":\"webUI\",\n            \"enabled:true\n          }\n}",
          "type": "json"
        },
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 401 Ok\n{\n  \"valid\":\"false\"\n  \"error_message\":\"token is expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/actions.js",
    "groupTitle": "Token",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/actions/checkiftokenisauth",
    "title": "Decode Token and check authorizations",
    "version": "1.0.0",
    "name": "Token_Decode_and_check_auth",
    "group": "Token",
    "description": "<p>Accessible only by microservice access tokens. Decodes the token, checking if this token type has the authorization to call a particular endpoint with a particular HTTP method (this parameter should be passed like http params ). It returns the contents bundled in the token and a field &quot;valid&quot; that indicates if token is valid end enabled.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "decode_token",
            "description": "<p>token to be unboxed</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "URI",
            "description": "<p>endpoint endpoint used to check if the token is authorized to call it</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "method",
            "description": "<p>HTTP method URL used to check if the token is authorized to call it</p> "
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
            "description": "<p>if true, the decoded token is valid, this token type is enabled to call this URI with the specified http method and a token field is returned. If false, the decoded token is not valid and an error_message field is returned</p> "
          },
          {
            "group": "200 - OK",
            "type": "Boolean",
            "optional": false,
            "field": "token",
            "description": "<p>decoded token information - returned only if valid field is true</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token._id",
            "description": "<p>id of the token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.email",
            "description": "<p>email address of the token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.type",
            "description": "<p>token owner type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.enabled",
            "description": "<p>if true, the owner is allowed to access the resource</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "error_message",
            "description": "<p>error message explaining the problem in decoding the token - returned only if field &quot;valid&quot; is false</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 Ok\n{\n  \"valid\":\"true\"\n  \"token\":{\n            \"_id\":\"eQO7de4AJe-syk\",\n            \"expires\":1467394099074,\n            \"email\":\"prova@prova.it\",\n            \"type\":\"webUI\",\n            \"enabled:true\n          }\n}",
          "type": "json"
        },
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 Ok\n{\n  \"valid\":\"false\"\n  \"error_message\":\"token is expired\"\n}",
          "type": "json"
        },
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 Ok\n{\n   \"valid\":\"false\"\n   \"error_message\":\"No auth roles defined for: GET /resource\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n{\n   \"error\":\"BadRequest\",\n   \"error_message\":\"No auth roles defined for: GET /resource\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      }
    },
    "filename": "routes/actions.js",
    "groupTitle": "Token"
  },
  {
    "type": "post",
    "url": "/actions/checkiftokenisauth",
    "title": "Decode Token and check authorizations with POST",
    "version": "1.0.0",
    "name": "Token_Decode_and_check_auth",
    "group": "Token",
    "description": "<p>Accessible only by microservice access tokens. Decodes the token, checking if this token type has the authorization to call a particular endpoint with a particular HTTP method (this parameter should be passed like HTTP params ). It returns the contents bundled in the token and a field &quot;valid&quot; that indicates if token is valid end enabled.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "decode_token",
            "description": "<p>token to be unboxed</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "URI",
            "description": "<p>endpoint endpoint used to check if the token is authorized to call it</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "method",
            "description": "<p>HTTP method URL used to check if the token is authorized to call it</p> "
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
            "description": "<p>if true, the decoded token is valid, this token type is enabled to call this URI with the specified http method and a token field is returned. If false, the decoded token is not valid and an error_message field is returned</p> "
          },
          {
            "group": "200 - OK",
            "type": "Boolean",
            "optional": false,
            "field": "token",
            "description": "<p>decoded token information - returned only if valid field is true</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token._id",
            "description": "<p>id of the token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.email",
            "description": "<p>email address of the token owner</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.type",
            "description": "<p>token owner type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.enabled",
            "description": "<p>if true, the owner is allowed to access the resource</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "token.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "error_message",
            "description": "<p>error message explaining the problem in decoding the token - returned only if field &quot;valid&quot; is false</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"valid\":\"true\"\n  \"token\":{\n            \"_id\":\"eQO7de4AJe-syk\",\n            \"expires\":1467394099074,\n            \"email\":\"prova@prova.it\",\n            \"type\":\"webUI\",\n            \"enabled:true\n          }\n}",
          "type": "json"
        },
        {
          "title": "Example: 200 OK",
          "content": " HTTP/1.1 200 OK\n {\n   \"valid\":\"false\",\n   \"error_message\"=\"Only userMs, WebUi token types can access this resource\"\n   \"token\":{\n             \"_id\":\"eQO7de4AJe-syk\",\n             \"expires\":1467394099074,\n             \"email\":\"prova@prova.it\",\n             \"type\":\"webUI\",\n             \"enabled:true\n           }\n}",
          "type": "json"
        },
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"valid\":\"false\"\n  \"error_message\":\"token is expired\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    \"error_message\":\"No auth roles defined for: GET /resource\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      }
    },
    "filename": "routes/actions.js",
    "groupTitle": "Token"
  },
  {
    "type": "post",
    "url": "/authuser/signup",
    "title": "Register a new User",
    "version": "1.0.0",
    "name": "Create_User",
    "group": "User",
    "description": "<p>Accessible only by microservice access tokens. Creates a new User object and returns the access credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
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
        "201 - CREATED": [
          {
            "group": "201 - CREATED",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>user Token</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>user refreshToken</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>refreshToken expiration date</p> "
          },
          {
            "group": "201 - CREATED",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>user id</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "  HTTP/1.1 201 CREATED\n  {\n    \"apiKey\":{\n              \"token\":\"VppR5sHU_hV3U\",\n              \"expires\":1466789299072\n             },\n    \"refreshToken\":{\n                      \"token\":\"eQO7de4AJe-syk\",\n                      \"expires\":1467394099074\n                   },\n   \"userId\":\"4334f423432\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p>Username or password not valid.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>Not Logged ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    \"error\":\"Unauthorized\",\n    \"error_description\":\"Warning: wrong username\"\n }",
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
    "description": "<p>Accessible only by microservice access tokens. Deletes the User and returns the deleted resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id *</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "UserField_1",
            "description": "<p>Contains field 1 defined in User Schema (example name)</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "UserField_2",
            "description": "<p>Contains field 2 defined in User Schema (example notes)</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "UserField_N",
            "description": "<p>Contains field N defined in User Schema (example type)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 - OK\n{\n  \"name\":\"Micio\",\n  \"notes\":\"Macio\",\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
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
    "description": "<p>Accessible only by microservice access tokens. Denies access to the User.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>the new Application status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\":\"disabled\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
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
    "description": "<p>Accessible only by microservices access_token. Grants access to the User.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>the new User status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\":\"enabled\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authuser",
    "title": "Get all Applications in authMs",
    "version": "1.0.0",
    "name": "Get_User",
    "group": "User",
    "description": "<p>Accessible only by microservice access tokens. Returns the paginated list of all Users. Set the pagination skip and limit in the URL request, e.g. &quot;get /authuser?skip=10&amp;limit=50&quot;</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
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
            "description": "<p>Object containing metadata for pagination info</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Number of results of this query skipped</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this query.</p> "
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
          "content": "{\n  \"users\":[\n                 {\n                     \"_id\": \"543fdd60579e1281b8f6da92\",\n                     \"email\": \"prova@prova.it\",\n                     \"name\": \"prova\",\n                     \"notes\": \"Notes About prova\"\n                 },\n                 {\n                  \"id\": \"543fdd60579e1281sdaf6da92\",\n                     \"email\": \"prova1@prova.it\",\n                     \"name\": \"prova1\", *\n                     \"notes\": \"Notes About prova1\"\n\n                },\n               ...\n            ],\n\n  \"_metadata\":{\n              \"skip\":10,\n              \"limit\":50,\n              \"totalCount\":100\n              }\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
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
    "description": "<p>Accessible only by microservice access_token. Returns info about Application in AuthMs microservice.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the User id</p> "
          }
        ]
      }
    },
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
          "content": "{\n   \"_id\": \"543fdd60579e1281b8f6da92\",\n   \"email\": \"prova@prova.it\",\n   \"name\": \"prova\",\n   \"notes\": \"Notes About prova\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authuser/signin",
    "title": "User login",
    "version": "1.0.0",
    "name": "Login_User",
    "group": "User",
    "description": "<p>Accessible only by microservice access tokens. Logs in the User and returns the access credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
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
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>information about apiKey token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>user Token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>information about refreshToken used to renew token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>user refreshToken</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>refreshToken expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>user id</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "HTTP/1.1 201 CREATED\n{\n  \"apiKey\":{\n            \"token\":\"VppR5sHU_hV3U\",\n            \"expires\":1466789299072\n           },\n  \"refreshToken\":{\n                    \"token\":\"eQO7de4AJe-syk\",\n                    \"expires\":1467394099074\n                 },\n \"userId\":\"4334f423432\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p>Username or password not valid.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>Not Logged ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    \"error\":\"Unauthorized\",\n    \"error_description\":\"Warning: wrong username\"\n }",
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
    "description": "<p>Accessible only by microservice access tokens. Creates a reset password Token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "reset_token",
            "description": "<p>the grant token to set the new password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"reset_token\":\"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authuser/:id/actions/setpassword",
    "title": "Update the User password in AuthMs",
    "version": "1.0.0",
    "name": "SetPassword",
    "group": "User",
    "description": "<p>Accessible only by microservice access tokens. Updates the User password.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the User id</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldpassword",
            "description": "<p>the current password to be changed. Overwrites reset_token parameter.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newpassword",
            "description": "<p>the new password</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reset_token",
            "description": "<p>a token used to set a new password. It is overwritten by oldpassword parameter</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "apiKey",
            "description": "<p>contains information about apiKey token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.token",
            "description": "<p>User Token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "apiKey.expires",
            "description": "<p>token expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "Object",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.token",
            "description": "<p>user refreshToken</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "refreshToken.expires",
            "description": "<p>refreshToken expiration date</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>user id</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"apiKey\":{\n            \"token\":\"VppR5sHU_hV3U\",\n            \"expires\":1466789299072\n           },\n  \"refreshToken\":{\n                    \"token\":\"eQO7de4AJe-syk\",\n                    \"expires\":1467394099074\n                 },\n \"userId\":\"4334f423432\"\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p>Username or password not valid.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>Not Logged ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    \"error\":\"Unauthorized\",\n    \"error_description\":\"Warning: wrong username\"\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/usertypes",
    "title": "Create a new user type",
    "version": "1.0.0",
    "name": "CreateUserType",
    "group": "UserType",
    "description": "<p>Accessible only by microservice access tokens. Creates a new user type and returns the created resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body.usertype",
            "description": "<p>the user type dictionary with all the fields. &quot;Name&quot; field is mandatory</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body.usertype.name",
            "description": "<p>the user type name</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"usertype\": {\"name\":\"ExternalWebUi\"}}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - OK": [
          {
            "group": "201 - OK",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the created user type</p> "
          },
          {
            "group": "201 - OK",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>name of the created user type</p> "
          },
          {
            "group": "201 - OK",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>type of the created user type. Must be equal to &quot;user&quot;</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": "HTTP/1.1 201 CREATED\n{\n  \"_id\":\"9804H4334HFN\",\n  \"name\":\"ExternaWebUi\",\n  \"type\":\"user\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/userTypes.js",
    "groupTitle": "UserType",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/usertypes/:id",
    "title": "delete user type",
    "version": "1.0.0",
    "name": "DeleteUserType",
    "group": "UserType",
    "description": "<p>Accessible only by microservice access tokens. Deletes the user type and returns the deleted resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>the user type id</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the user type name</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 Ok",
          "content": " HTTP/1.1 200 Ok\n{\n   \"_id\":\"543fdd60579e1281b8f6da92\",\n   \"name\":\"externalWebUi\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/userTypes.js",
    "groupTitle": "UserType",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "409_Conflict",
            "description": "<p><b>Conflict:</b> Indicates that the request could not be processed because of conflict in the request. For Example a resource could not be deleted because is used from other resource <b>request.body.error</b> contains an error name specifing the Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the conflict.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/usertypes",
    "title": "Get all user types",
    "version": "1.0.0",
    "name": "GetAllUserTypes",
    "group": "UserType",
    "description": "<p>Accessible only by other microservice access tokens. Returns a paginated list of all available user types.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          }
        ]
      }
    },
    "filename": "routes/userTypes.js",
    "groupTitle": "UserType",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_metadata",
            "description": "<p>Object containing metadata for pagination info</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Number of results of this query skipped</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this query.</p> "
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
          "content": "{\n  \"users\":[\n                 {\n                     \"_id\": \"543fdd60579e1281b8f6da92\",\n                     \"email\": \"prova@prova.it\",\n                     \"name\": \"prova\",\n                     \"notes\": \"Notes About prova\"\n                 },\n                 {\n                  \"id\": \"543fdd60579e1281sdaf6da92\",\n                     \"email\": \"prova1@prova.it\",\n                     \"name\": \"prova1\", *\n                     \"notes\": \"Notes About prova1\"\n\n                },\n               ...\n            ],\n\n  \"_metadata\":{\n              \"skip\":10,\n              \"limit\":50,\n              \"totalCount\":100\n              }\n}",
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
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/usertypes/:id",
    "title": "Get user type by Id",
    "version": "1.0.0",
    "name": "GetUserTypeById",
    "group": "UserType",
    "description": "<p>Accessible only by other microservice access tokens. Given an user type Id, returns its info.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the user type id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>the user type id</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the user type name</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK, Success Response",
          "content": "{\n\n   \"_id\": \"543fdd60579e1281b8f6da92\",\n   \"name\": \"externalWebUi\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/userTypes.js",
    "groupTitle": "UserType",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/usertypes/:id",
    "title": "update user type info",
    "version": "1.0.0",
    "name": "UpdateUserType",
    "group": "UserType",
    "description": "<p>Accessible only by microservice access tokens. Updates  theuser type info and returns the updated resource.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>token that grants access to this resource. It must be sent in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the user type id</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "usertype",
            "description": "<p>the user type dictionary with all the updatable fields</p> "
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "usertype.name",
            "description": "<p>the user type name</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 PUT request\n Body:{ \"usertype\": {\"name\":\"ExternalWebUi\"}}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200 - OK": [
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the updated user type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>name of the updated user type</p> "
          },
          {
            "group": "200 - OK",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>type of the updated user type. Must be equal to &quot;user&quot;</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 Ok",
          "content": " HTTP/1.1 200 OK\n{\n   \"_id\":\"9804H4334HFN\",\n   \"name\":\"ExternaWebUi\",\n   \"type\":\"user\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/userTypes.js",
    "groupTitle": "UserType",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p>Not authorized to call this endpoint.<BR> <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR> <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p>The Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR> <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "409_Conflict",
            "description": "<p><b>Conflict:</b> Indicates that the request could not be processed because of conflict in the request. For Example a resource could not be deleted because is used from other resource <b>request.body.error</b> contains an error name specifing the Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the conflict.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400_BadRequest",
            "description": "<p>The server cannot or will not process the request due to something perceived as a client error<BR> <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR> <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p>Internal Server Error. <BR> <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    \"error\":\"invalid_token\",\n    \"error_description\":\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    \"error\": 'Internal Error'\n    \"error_message\": 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  }
] });