# API Specification

[1.2 User](./#1.2-user)

## 1 General
### 1.1 Version
Retrieve the current version of the backend
```
GET /api/version
```
**Response**
```
Status: 200

json
{
  "version": 13.0
}
```

### 1.2 User
(#anchors-in-markdown)
Fetch the currently logged in user.

*Login Required*
```
GET /api/user
```
**Response**
```
Status: 200

json
{
  "email": student.centerling@cdtm.de
}
```


## 1 List
