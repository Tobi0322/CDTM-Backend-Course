# Setup

*The goal of this tutorial is to get you up and running for the rest of the course. Especially the following things should be working after completinging it:*
* Chrome 
* A text editor 
* Python 2.7.x
* Flask
* Git

## 1 Windows

### 1.1 Chrome
Install the latest version from the official website: https://www.google.de/chrome/browser/desktop/

### 1.2 Text Editor
Feel free to use a text editor or python IDE of your choice. I recommend Atom, which can be downloaded from https://atom.io/.

### 1.3 Python
1. Check whether you have python installed. There should be a folder ```C:\Python27```. 
  If not, go to https://www.python.org/downloads/ and download the latest stable relase of Python 2.7.x and run the installer.
  The folder should now be there.
2. Check whether you can run python from the terminal. Open CMD and type ```python --version```. If you get an error message be sure to add python to your PATH. Close CMD and run it 'as administrator'. Type the following command: ```setx /M PATH "%PATH%;C:\Python27"```. Close CMD and open it again. You should now be able to run python from command line.
3. Next make sure pip, a package manager for python packages was installed properly. From the command line run ```pip --version```. If you get an error restart CMD as administrator and run ```setx /M PATH "%PATH%;C:\Python27\Scripts"```. Reopen CMD and it should work.

**NOTE:** Working with CMD or Powershell on Windows can be quite cumbersome at times. There is a nice console emulator for Windows called 'cmder' that brings bash syntax to windows. I recommend using it instead of CMD. Just install the latest release from http://cmder.net/ and add it to your PATH as well ``setx /M PATH "%PATH%;`C:\Program Files\cmder"```.

### 1.4 Flask
Now you should be able to install flask, a microframework for web-development by running ```pip install flask```. 
Verify it by launching the python interactive shell (run ```python```) and type ```import flask```. You are good to go, if there is no error message.

## 2 MacOS

### 2.1 Chrome
Install the latest version from the official website: https://www.google.de/chrome/browser/desktop/

### 2.2 Text Editor
Feel free to use a text editor or python IDE of your choice. I recommend Atom, which can be downloaded from https://atom.io/.

### 2.3 Python
MacOS shipes with python. However, since MacOS ElCapitan a feature called *System Integrity Protection* conflicts with pip, a python packages manager we need. Therefore we have to reinstall python using homebrew.

1. Install homebrew, a package manager for MacOS. Open a terminal and run 
  ```/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"```.
2. Install python using homebrew by running ```brew install python```.
3. Check whether python ```python --version``` and pip ```pip --version``` were successfully installed.

### 2.4 Flask
Now you should be able to install flask, a microframework for web-development by running ```pip install flask```. 
Verify it by launching the python interactive shell (run ```python```) and type ```import flask```. You are good to go, if there is no error message.

## 3 Linux (Ubuntu) 
(If your are running a different distro, I assume you are familiar with the built in package manager ;-) )

### 3.1 Chrome
You can either install Chrome (only 64bit) or Chromium. Just open a terminal and insert the following commands.

#### Google Chrome
```
cd /tmp
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
```

#### Chromium
```
sudo apt-get install chromium-browser chromium-browser-l10n chromium-codecs-ffmpeg 
```

### 3.2 Text Editor
Feel free to use a text editor or python IDE of your choice. I recommend Atom, which can be downloaded from https://atom.io/.

```
sudo add-apt-repository ppa:webupd8team/atom
sudo apt-get update
sudo apt-get install atom
```

### 3.3 Python
1. Open a terminal and check your version of python ```python --version```. If it is < 2.7.12 run ```sudo apt-get upgrade python```.
2. Check whether pip is installed ```pip --version```. If it is not installed run ```sudo apt-get install python-pip```.

### 3.4 Flask
Now you should be able to install flask, a microframework for web-development by running ```pip install flask```. 
Verify it by launching the python interactive shell (run ```python```) and type ```import flask```. You are good to go, if there is no error message.
