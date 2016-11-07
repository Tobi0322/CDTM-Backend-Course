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
  - [fetch the currently logged in user](#fetch-the-currently-logged-in-user)
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
  - [get a specific file](#get-a-specific-file)
  - [upload files](#upload-files)
  - [delete a file permanently](#delete-a-file-permanently)

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

### Fetch the currently logged in user
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
>   "email": student.centerling@cdtm.de
> }
> ```

## 4 List
### Get all lists a user has permission to

### Get a specific list

### Create a list

### Update a list by overwriting properties

### Delete a list permanently

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
>     "starred": true
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
>   "starred": true
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
>   "starred": true
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
>   "starred": true
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
>   "starred": true
> }
> ```
### Delete a task permanently
### Get a specific file
### Upload files
### Delete a file permanently
