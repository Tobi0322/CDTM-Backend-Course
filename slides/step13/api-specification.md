# API Specification

## Endpoints
1. [Version](#1-version)
  1. [retrieve the current version of the api](#retrieve-the-current-version-of-the-api)
2. [Authentication](#2-authentication)
3. [User](#3-user)
  1. [Fetch the currently logged in user](#fetch-the-currently-logged-in-user)
4. [List](#4-list)
5. [Task](#5-task)

## 1 Version

### Retrieve the current version of the api
```
GET /api/version
```
#### Response
```
Status: 200

json
{
  "version": 13.0
}
```
## 2 Authentication

## 3 User

### Fetch the currently logged in user
*Login Required*
```
GET /api/user
```
#### Response
```
Status: 200

json
{
  "email": student.centerling@cdtm.de
}
```

## 4 List

## 5 Task
