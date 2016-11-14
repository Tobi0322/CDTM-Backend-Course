# API Specification

#### Content-Type
All requests that POST, PATCH, or PUT JSON must set a `Content-Type` header with a value of `application/json`. 
#### Date and Time Format
All dates and times in the API are formatted as `'yyyy-MM-dd'` strings. All times are provided as UTC. For example: 1970-01-01

## Endpoints
1. [Version](#1-version)
  - [retrieve the current version of the api](#retrieve-the-current-version-of-the-api)
2. [Authentication](#2-authentication)
  - [retrieve whether a session is active on the server](#retrieve-whether-a-session-is-active-on-the-server)
  - [register a new user](#register-a-new-user)
  - [perform a login operation](#perform-a-login-operation)
  - [perform a logout operation](#perform-a-logout-operation)
3. [User](#3-user)
  - [get the currently logged in user](#get-the-currently-logged-in-user)
  - [get a specific user](#get-a-specific-user)
4. [List](#4-list)
  - [get all lists a user has permission to](#get-all-lists-a-user-has-permission-to)
  - [get a specific list](#get-a-specific-list)
  - [create a list](#create-a-list)
  - [update a list by overwriting properties](#update-a-list-by-overwriting-properties)
  - [delete a list permanently](#delete-a-list-permanently)
5. [Task](#5-task)
  - [get tasks for a list](#get-tasks-for-a-list)
  - [get a specific task](#get-a-specific-task)
  - [create a task](#create-a-task)
  - [update a task by overwriting properties](#update-a-task-by-overwriting-properties)
  - [delete a task permanently](#delete-a-task-permanently)
6. [Upload](#6-upload)
  - [get a specific file](#get-a-specific-file)
  - [upload files](#upload-files)
  - [delete a file permanently](#delete-a-file-permanently)
7. [Collaborator](#6-collaborator)
  - [add a collaborator to a specific list](#add-a-collaborator-to-a-specific-list)
  - [remove a collaborator from a specific list](#remove-a-collaborator-from-a-specific-list)

## 1 Version
> ### Retrieve the current version of the api
> ```
> GET /api/version
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "version": 13.0
> }
> ```

## 2 Authentication

### Retrieve whether a session is active on the server
> ```
> GET /api/status
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "result: true
> }
> ```

### Register a new user
> ```
> POST /api/register
> ```
> #### Data
> | Name          | type             | required |
> | ------------- |------------------| -------- |
> | email         | String           | true     |
> | password      | String           | true     | 
> #### Request body example
> ```
> {
>   "email": "student.centerling@cdtm.de",
>   "password": "123456"
> }
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "result: true
> }
> ```

### Perform a login operation
> ```
> POST /api/login
> ```
> #### Data
> | Name          | type             | required |
> | ------------- |------------------| -------- |
> | email         | String           | true     |
> | password      | String           | true     | 
> #### Body
> ```
> {
>   "email": "student.centerling@cdtm.de",
>   "password": "123456"
> }
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "result: true
> }
> ```


### Perform a logout operation
> ```
> POST | GET /api/logout
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "result: true
> }
> ```


## 3 User

### Get the currently logged in user
> - *Login Required*
> ```
> GET /api/user
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "id": 1234,
>   "email": student.centerling@cdtm.de
> }
> ```

### Get a specific user
> - *Login Required*
> ```
> GET /api/user/:id
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "id": 12345,
>   "email": student2.centerling@cdtm.de
> }
> ```

## 4 List
### Get all lists a user has permission to
> - *Login Required*
> ```
> GET /api/lists
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "lists": [
>     "id": 41234567,
>     "owner": 1234,
>     "title": "Groceries",
>     "revision": 1,
>     "collaborators": []
>   ]
> }
> ```

### Get a specific list
> - *Login Required*
> - The user needs to have rights to access the specified list
> ```
> GET /api/lists/:id
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "id": 41234567,
>   "owner": 1234,
>   "title": "Groceries",
>   "revision": 17,
>   "collaborators": [12345, 124211]
> }
> ```

### Create a list
> - *Login Required*
> ```
> POST /api/lists
> ```
> #### Data
> | Name          | type             | required |
> | ------------- |------------------| -------- |
> | title         | String           | true     |
> #### Request body example
> ```
> {
>   "title": "Christmas Presents!!!"
> }
> ```
> #### Response
> ```
> Status: 201
> 
> json
> {
>   "id": 132456,
>   "owner": 1234,
>   "title": "Christmas Presents!!!",
>   "revision": 1,
>   "collaborators": []
> }
> ```

### Update a list by overwriting properties
> - *Login Required*
> - The user needs to have rights to access the specified list
> - Only if client's `revision` is greater or equal to the server's `revision` it is updated
> - The `owner` property is only updated if the request is sent by the current owner.
> ```
> PUT /api/lists/:id
> ```
> #### Data
> | Name          | type             | required |
> | ------------- |------------------| -------- |
> | title         | Integer          | true     |
> | owner         | String           | true     |
> | revision      | Int              | true     |
> | collaborators | [String]         | true     |
> #### Request body example
> ```
> {
>   "id": 132456,
>   "owner": 1234,
>   "title": "Christmas Presents (URGENT)!!!",
>   "revision": 1,
>   "collaborators": []
> }
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "id": 132456,
>   "owner": 1234,
>   "title": "Christmas Presents (URGENT)!!!",
>   "revision": 2,
>   "collaborators": []
> }
> ```

### Delete a list permanently
> - *Login Required*
> - The user needs to have rights to access the specified list
> ```
> DELETE /api/lists/:id
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "result": true
> }
> ```

## 5 Task
### Get tasks for a list
> - *Login Required*
> - The user needs to have rights to access the specified list
> ```
> GET /api/lists/:id/tasks
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "tasks": [
>     "id": 41234567,
>     "list": 1234545,
>     "title": "Graduate from CDTM",
>     "status": "normal",
>     "description": "I really need to do 2 more electives...",
>     "due": "1970-01-01",
>     "revision": 1,
>     "starred": true,
>     "files": []
>   ]
> }
> ```

### Get a specific task
> - *Login Required*
> - The user needs to have rights to access the specified list
> ```
> GET /api/lists/:id/tasks/:id
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "id": 41234567,
>   "list": 1234545,
>   "title": "Graduate from CDTM",
>   "status": "normal",
>   "description": "I really need to do 2 more electives...",
>   "due": "1970-01-01",
>   "revision": 1,
>   "starred": true,
>   "files": []
> }
> ```

### Create a task
> - *Login Required*
> - The user needs to have rights to access the specified list
> ```
> POST /api/lists/:id/tasks
> ```
> #### Data
> | Name          | type             | required |
> | ------------- |------------------| -------- |
> | title         | String           | true     |
> #### Request body example
> ```
> {
>   "title": "Make task management great again!"
> }
> ```
> #### Response
> ```
> Status: 201
> 
> json
> {
>   "id": 41234567,
>   "list": 1234545,
>   "title": "Make task management great again!",
>   "status": "normal",
>   "description": "",
>   "due": null,
>   "revision": 1,
>   "starred": true,
>   "files": []
> }
> ```

### Update a task by overwriting properties
> - *Login Required*
> - The user needs to have rights to access the specified list
> - Only if client's `revision` is greater or equal to the server's `revision` it is updated
> ```
> PUT /api/lists/:id/tasks/:id
> ```
> #### Data
> | Name          | type             | required |
> | ------------- |------------------| -------- |
> | list          | Integer          | true     |
> | title         | String           | true     |
> | status        | String           | true     |
> | description   | String           | true     |
> | due           | String           | true     |
> | revision      | Int              | true     |
> | starred       | Boolean          | true     |
> #### Request body example
> ```
> {
>   "id": 41234567,
>   "list": 1234545,
>   "title": "Update all the tasks!!!",
>   "status": "normal",
>   "description": "",
>   "due": null,
>   "revision": 23,
>   "starred": true,
>   "files": []
> }
> ```
> #### Response
> ```
> Status: 201
> 
> json
> {
>   "id": 41234567,
>   "list": 1234545,
>   "title": "Update all the tasks!!!",
>   "status": "normal",
>   "description": "",
>   "due": null,
>   "revision": 24,
>   "starred": true,
>   "files": []
> }
> ```

### Delete a task permanently
> - *Login Required*
> - The user needs to have rights to access the specified list
> ```
> DELETE /api/lists/:id/tasks/:id
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "result": true
> }
> ```

## 6 Upload

### Get a specific file
> - *Login Required*
> - The user needs to have rights to access the specified list
> ```
> GET /api/lists/:id/tasks/:id/files/String:filename
> ```
> #### Response
> - Returns the actual file

### Upload files
> - *Login Required*
> - The user needs to have rights to access the specified list
> - Upload must happen via form, where ```files[]```contains all the files.
> ```
> POST /api/lists/:id/tasks/:id/files
> ```
> #### Response
> ```
> Status: 201
> 
> json
> {
>   "id": 41234567,
>   "list": 1234545,
>   "title": "Update all the tasks!!!",
>   "status": "normal",
>   "description": "",
>   "due": null,
>   "revision": 24,
>   "starred": true,
>   "files": ["the_uploaded_filename.png", "the_2nd_uploaded_filename.png"]
> }
> ```

### Delete a file permanently
> - *Login Required*
> - The user needs to have rights to access the specified list
> ```
> DELETE /api/lists/:id/tasks/:id/files/String:filename
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "result": true
> }
> ```

## 7 Collaborator

### Add a collaborator to a specific list
> - *Login Required*
> - The user needs to be the owner of the specified list
> ```
> POST /api/lists/:id/tasks/:id/collaborators/:id
> ```
> #### Response
> (returns the list with updated collaborators)
> ```
> Status: 201
> 
> json
> {
>   "id": 132457,
>   "owner": 1234,
>   "title": "Clean the kitchen :-/",
>   "revision": 2,
>   "collaborators": [9876]
> }
> ```

### Remove a collaborator from a specific list
> - *Login Required*
> - The user needs to be the owner of the specified list
> ```
> DELETE /api/lists/:id/tasks/:id/collaborators/:id
> ```
> #### Response
> ```
> Status: 200
> 
> json
> {
>   "result": true
> }
> ```
