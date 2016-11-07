# API Specification

All requests that POST, PATCH, or PUT JSON must set a `Content-Type` header with a value of `application/json`. 

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
> *@Login Required*
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
### Get a specific task
### Create a task
### Update a task by overwriting properties
### Delete a task permanently
### Get a specific file
### Upload files
### Delete a file permanently
