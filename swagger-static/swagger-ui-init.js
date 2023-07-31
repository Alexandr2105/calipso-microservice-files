
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registrationUsers",
          "summary": "Registration users",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email confirmation link sent"
            },
            "400": {
              "description": "List of possible errors:<br>1.User with this username is already registered <br>2.User with this email is already registered<br> 3.Wrong length\n",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/email-confirmation/{code}": {
        "get": {
          "operationId": "AuthController_registrationConfirmation",
          "summary": "Email confirmation",
          "parameters": [
            {
              "name": "code",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Email successfully verified"
            },
            "400": {
              "description": "Incorrect confirmation code",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-link": {
        "post": {
          "operationId": "AuthController_refreshConfirmationLink",
          "summary": "Refresh confirmation link",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationEmailResendingDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Link updated"
            },
            "400": {
              "description": "List of possible errors:<br>1.Bad request<br>2.Invalid email",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_loginUser",
          "summary": "User authorization",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "accessToken": {
                        "type": "string",
                        "description": "Access token for authentication."
                      },
                      "profile": {
                        "type": "boolean",
                        "description": "Indicates if a profile exists."
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "summary": "Password recovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailResendingDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Even if the current email address is not registered (to prevent the user's email from being detected)"
            },
            "400": {
              "description": "Invalid email address",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_createNewPassword",
          "summary": "Creating a new password",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "If the code is valid and the new password is accepted"
            },
            "400": {
              "description": "List of possible errors:<br>1.Wrong length newPassword<br> 2.Incorrect confirmation code"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "summary": "User logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            },
            "401": {
              "description": "The JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_updateRefreshToken",
          "summary": "Generate new pair of access and refresh tokens",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken in body and JWT refreshToken in cookie ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "accessToken": {
                        "type": "string",
                        "description": "Access token for authentication."
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "The JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_getInfoAboutMe",
          "summary": "Returns user data",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserEntity"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/delete-all-data": {
        "delete": {
          "operationId": "TestingController_clearAllData",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/users/profiles/profile": {
        "get": {
          "operationId": "UsersProfilesController_getUserProfile",
          "summary": "Get user profile",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UsersProfilesEntity"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Profiles"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/users/profiles/save-profileInfo": {
        "post": {
          "operationId": "UsersProfilesController_saveUsersProfiles",
          "summary": "Create profile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UsersProfilesDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "User saved"
            },
            "400": {
              "description": "List of possible errors:<br>1.Wrong length.<br>2.Invalid date format. Please use the format dd-mm-yyyy.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Profiles"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/users/profiles/save-avatar": {
        "post": {
          "operationId": "UsersProfilesController_saveAvatar",
          "summary": "Upload avatar. \"fieldName\" must be \"avatar\"",
          "parameters": [],
          "responses": {
            "204": {
              "description": "Avatar created"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Profiles"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/posts/post": {
        "post": {
          "operationId": "PostsController_createPosts",
          "summary": "Create post. \"fieldName\" must be \"posts\"",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DescriptionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Post created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostEntityWithImage"
                  }
                }
              }
            },
            "400": {
              "description": "List of possible errors:<br>1.Wrong length<br>2.More than 10 photos",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/posts/post/{postId}": {
        "put": {
          "operationId": "PostsController_updatePost",
          "summary": "Update description for post",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DescriptionDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Post updated"
            },
            "400": {
              "description": "Wrong length",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "PostsController_getPost",
          "summary": "Get info for post",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostEntityWithImage"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "PostsController_deletePost",
          "summary": "Delete post",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Post deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/posts/{userId}": {
        "get": {
          "operationId": "PostsController_getPostsCurrentUser",
          "summary": "Get post for current user",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "What field to sort by",
              "schema": {
                "default": "createdAt"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string",
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Page number to return",
              "schema": {
                "default": 1,
                "type": "integer"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Number of elements to return",
              "schema": {
                "default": 9,
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostQueryType"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "Instagram",
      "description": "The Instagram API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "minimum": 6,
              "maximum": 30
            },
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string",
              "minimum": 6,
              "maximum": 20
            }
          },
          "required": [
            "login",
            "email",
            "password"
          ]
        },
        "RegistrationEmailResendingDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "EmailResendingDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "minimum": 6,
              "maximum": 20
            },
            "recoveryCode": {
              "type": "string"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "UserEntity": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "User id"
            },
            "login": {
              "type": "string",
              "description": "User login"
            },
            "email": {
              "type": "string",
              "description": "User email"
            }
          },
          "required": [
            "id",
            "login",
            "email"
          ]
        },
        "UsersProfilesEntity": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "User id"
            },
            "login": {
              "type": "string",
              "description": "User login"
            },
            "firstName": {
              "type": "string",
              "description": "User first name"
            },
            "lastName": {
              "type": "string",
              "description": "User last name"
            },
            "dateOfBirthday": {
              "type": "string",
              "description": "User date of birthday"
            },
            "city": {
              "type": "string",
              "description": "User city"
            },
            "userInfo": {
              "type": "string",
              "description": "User info"
            },
            "photo": {
              "type": "string",
              "description": "User avatar"
            }
          },
          "required": [
            "userId",
            "login",
            "firstName",
            "lastName",
            "dateOfBirthday",
            "city",
            "userInfo",
            "photo"
          ]
        },
        "UsersProfilesDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "minimum": 6,
              "maximum": 30
            },
            "firstName": {
              "type": "string",
              "maximum": 50
            },
            "lastName": {
              "type": "string",
              "maximum": 50
            },
            "dateOfBirthday": {
              "type": "string"
            },
            "city": {
              "type": "string",
              "maximum": 50
            },
            "userInfo": {
              "type": "string",
              "maximum": 200
            }
          },
          "required": [
            "login",
            "firstName",
            "lastName",
            "dateOfBirthday",
            "city",
            "userInfo"
          ]
        },
        "DescriptionDto": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string",
              "maximum": 500
            }
          },
          "required": [
            "description"
          ]
        },
        "PostsImagesEntityForSwagger": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "Url image"
            }
          },
          "required": [
            "url"
          ]
        },
        "PostEntityWithImage": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Post id"
            },
            "userId": {
              "type": "string",
              "description": "UserId"
            },
            "description": {
              "type": "string",
              "description": "Description post"
            },
            "createdAt": {
              "type": "string",
              "description": "Created Date"
            },
            "images": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PostsImagesEntityForSwagger"
              }
            }
          },
          "required": [
            "id",
            "userId",
            "description",
            "createdAt",
            "images"
          ]
        },
        "PostQueryType": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Number of items sorted"
            },
            "page": {
              "type": "number",
              "description": "Number of pages"
            },
            "pageSize": {
              "type": "number",
              "description": "Page Size"
            },
            "totalCount": {
              "type": "number",
              "description": "Total items"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PostEntityWithImage"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
