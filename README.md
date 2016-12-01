# CDTM Backend Course

## Workflow
**IMPORTANT:** This repository is the initial point for conducting a backend workshop with a class of students. It is important that you **DO NOT MODIFY** the repository itself. Instead follow these steps:

1. Either fork or duplicate this repository
   * Fork: Just press the button. 
   * Duplicate
        1. Mirror the repository according to [Mirroring a repository](https://help.github.com/articles/duplicating-a-repository/#mirroring-a-repository)
        2. Duplicate the wiki
          1. Create a wiki page for your new repository
          2. Clone this repository's wiki repository: `git clone https://github.com/FroeMic/CDTM-Backend-Course.wiki.git
          3. Force push the wiki repository to your new repository's wiki repository: 
            `cd CDTM-Backend-Course.wiki` and
            `git push --https://github.com/YOURUSERNAME/YOURNEWREPOSITORYNAME.wiki.git`
 2. Prepare repository for students
    1. Checkout both the 'master' and 'solution' branch on your local machine
    2. Force delete the remote 'solution' branch (still keep it offline)
 3. Let students fork your new repository. The will only see the 'master' branch
 4. Let the students add your repository's master branch as 'upstream' 
    * Sourcetree Instructions:
        1. Open your forked repo in SourceTree.
        2. Select Repository ➫ Repository Settings… in the menu (or press ⇧⌘,).
        3. In the Remotes pane, press Add.
        4. Enter any name you like (often upstream or master) and the URL / path to the parent repo.
        5. Press OK, then OK.
     * Git Console:
        https://help.github.com/articles/configuring-a-remote-for-a-fork/
 5. Everytime you want to publish a step to the students, merge the specific commit from you **local** 'solution' branch into 'master' and push your changes.
 6. For the students to receive the changes, let them pull from upstream
    * Sourcetree:
        1. Select 'upstream' from 'pull from repository' dropdown
        2. Select 'master' from 'pull from repository' dropdown
        3. Press ok
    * Git console
        https://help.github.com/articles/syncing-a-fork/
  
 **IMORTANT:** For this to work, the students should only work in the folders specified in the exercise instructions.


## Repository Structure
```
.
+-- README.md
+-- demo/               (demo code goes here)
|   +-- step01/         (tutorial step x)
    |   +-- frontend/   (demo frontend)
    |   +-- backend/    (sample solution)
+-- src/                (your code goes here)
+-- tutorials/          (tutorials)
+-- slides/             (lecture slides and cheatsheets)
```

## Agenda
We want to give you an overview what is planned for the next days. We are trying to stick to the agenda, but as we are doing this course for the first time we might reschedule a little bit on the fly.

### Preparation
We designed this course for students with limited programming skills. With this in mind, we want to avoid repeating the 'Basics of Programming' lecture from the Trend Seminar. Therefore we would ask you to complete the *Codeacademy Learn Python* tutorial **before the start of the course** to get you up and running.

#### Codeacademy Learn Python
Link: https://www.codecademy.com/learn/python
> * Get's you up to speed :-)
> * You should be comfortable with the following concepts aftwards
>     * variables
>     * strings
>     * functions
>     * parameters
>     * control flow (if, elif, else)
>     * loops (while, for)
>     * lists  
>     * dictionaries
>     * tuples
>     * Object Orientation (Classes, methods)


#### Other Resources
*You don't have to do this as preparation, but this might come in handy when you are having trouble with some concepts or want to dive in a little bit deeper.*
* Python [Cheatsheet](slides/cheatsheet_python_slim.pdf "click me hard!!")
* Learn Python the Hard Way (https://learnpythonthehardway.org/book/)
    * The best beginner programmer’s guide to Python, which covers everything from “hello world” to the console to the web.
* Python Crash Course (https://www.nostarch.com/pythoncrashcourse)
    * A book (~ 30 € ) giving a hands-On, project-based introduction to programming in Python.


### Friday (17:00 - 21.00)
On Friday we will kick off the course with a short lecture introducing the concept of *Backend / Frontend*. After that we will setup your systems to run all the needed frameworks and libraries. And finally each of you will implement their very own web-server.

> **TODO**
> - [ ] Lecture Frontend / Backend Introduction
>   - [ ] Terminology
>   - [ ] Rationale why there is a distinction
>   - [ ] Development Stacks & Examples (http://stackshare.io/stacks)
> - [X] [Setup Tutorial](./tutorial/0-Setup.md "Install all the things!")
>   - [X] Setup Chrome
>   - [X] Setup IDE / text editor
>   - [X] Setup Python
>   - [X] Setup Flask
>   - [X] Setup Git
> - [X] Python Cheatsheet
> - [X] Bash / CMD Cheatsheet
> - [ ] Introduction Tools / Frameworks
>   - [ ] Chrome Developer Tools  
>   - [ ] Bash / CMD (basics)
>   - [ ] Git / Github
>   - [ ] Flask
> - [X] Demo Code Hello-World-Server

### Saturday (09:00 - 17:00)
Today we will concentrate on implementing the basic application logic of our application. In short lectures you will be introduced to the basics of *HTTP*, *REST*, *Databases* and *SQL*.
After today your server should be capable of the following things:
* Having a data modell for Todo-Items
* Handling CRUD (Create, Read, Update, Destroy) requests for Todo-Items over a RESTful API
* Storing Todo-Items persistently in a database

> **TODO**
> - [ ] Lectures
>   - [ ] Objects: Object Orientation
>   - [ ] Routing: HTTP, REST and JSON
>   - [ ] Persistent Storage: Databases and SQL
>   - [ ] File Handling
> - [ ] Introduction Tools / Frameworks
>   - [ ] Postman
>   - [ ] SQLite
> - [X] Tutorial & Demo Code  
>   - [X] 1. Todo-Item Object (State, Name) + Routing: get all Todo-Items
>   - [X] 2. Routing: create new Todo-Item
>   - [X] 3. Routing: delete Todo-Item
>   - [X] 4. Routing: update Todo-Item
>   - [X] 5. DB: SQLlite, Todo-Item-Schema
>   - [X] 6. DB: Connect API with DB
>   - [X] 7. DB: Sanitize Input
>       - DELETE: http://127.0.0.1:20007/api/tasks/20%20or%201=1
>   - [X] 8. Functionality: Date & Description
>   - [X] 9. Functionality: Files


### Sunday (09:00 -17:00)
Up to now everything could have been done on the client directly. One advantage of having a centralized backend is that we can access and manipulate the same information with multiple clients. Today's goal is to implement user authentication and allow to share TodoItems.

> **TODO**
> - [ ] Lectures
>   - [ ] User Authentication Basics
>   - [ ] Shared Objects Implementation Strategy
> - [ ] Tutorial & Demo Code  
>   - [X] 1. Refactor (?) (Would be nice at this point as, everyone has to review their code)
>   - [X] 2. User: Register User
>   - [X] 3. User: Login / Logout
>   - [ ] 4. Private Todo-Items: Secure API
>   - [ ] 5. Organise Todo-Items Into Lists
>       - Default Lists: Inbox, Today, This Week
>       - Refactor DB
>       - Refactor API
>   - [ ] 6. Custom Lists
>       - CRUD
>   - [ ] 7. Shared Lists
>       - Invite User: GET User
>       - Remove User: GET User
>       - Leave Shared List: GET User
>   - [ ] 5. Todo-Groups
