<!-- Write a readme to quick review in guide people to use this  -->
# README.MD

## Introduction

This is a simple project to connect and chat with open ai completion chatbot.

## Installation

### Install nodejs

#### Linux

```bash 
sudo apt-get install nodejs
```

#### Windows

```bash
choco install nodejs
```

### Install npm

#### Linux

```bash
sudo apt-get install npm
```

#### Windows

```bash
choco install npm
```

<!-- Start the project -->

## Start the project

### Install dependencies

```bash
npm install
```

### Setups the environment

Create .env file in the root directory and add the following variables and add your own key get from openai into the .env file with key "**OPENAI_API_KEY**".

```bash
cat > .env
echo OPENAI_API_KEY=<YOURKEY> > .env
```

### Start the project

```bash
npm start
```

