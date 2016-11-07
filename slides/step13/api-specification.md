# API Specification

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
5. [Task](#5-task)

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
> #### Params
> | Name          | value            | required |
> | ------------- |------------------| -------- |
> | content-type  | application/json | true     |
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

### Perform a login operation
> ```
> POST /api/login
> ```
> #### Params
> | Name          | value            | required |
> | ------------- |------------------| -------- |
> | content-type  | application/json | true     |
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
> POST /api/logout
> ```
> #### Params
> | Name          | value            | required |
> | ------------- |------------------| -------- |
> | content-type  | application/json | true     |
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
> *Login Required*
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

## 5 Task
