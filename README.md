# envar-cli
![](https://img.shields.io/github/issues/kodcanlisi/envar-cli)

## Getting Started
envar-cli is lightweight global package for managing .env variables using cli. 
You can add, update, remove or list environment variables.

## Install
``` shell
# with npm
npm install -g envar-cli
```

## Usage
Open your terminal on project folder and check the below instructions. To get help please write **envar-cli --help** on terminal.

### Specify The .env File Extension
There are several .env file extension. 
Default file is **.env** for **envar-cli**.

 **envar-cli** supports:
* .env
* .env.example
* .env.local
* .env.dev
* .env.development
* .env.prod
* .env.production
* .env.staging
* .env.preview

Please specify the extension end of the command with --[fileSpecifier]
#### Select The File Extension
``` shell
envar-cli [command] [value] [extension]

# Select .env (do not write anything)
#.env is default. No need to write anything.

# .env.example
envar-cli [command] [value] --example

# .env.local
envar-cli [command] [value] --local

# .env.dev
envar-cli [command] [value] --dev

# .env.development
envar-cli [command] [value] --development

# .env.prod
envar-cli [command] [value] --prod

# .env.production
envar-cli [command] [value] --production

# .env.staging
envar-cli [command] [value] --staging

# .env.preview
envar-cli [command] [value] --preview
```

### Add Variable
If .env file is not exists **envar-cli** will create a blank .env file.

``` shell
envar-cli add "PORT=9000"
# or
envar-cli add PORT=9000

#with specific .env file --[extension]
envar-cli add PORT=3000 --dev
envar-cli add PORT=8080 --prod
```

#### Result:
**.env**:
``` txt
PORT=9000
```

**.env.dev**:
``` txt
PORT=3000
```

**.env.prod**:
``` txt
PORT=8080
```

### Add Variable With Comment
If you want to add a comment to your .env file, please use **--comment** option. It will be add your comment line before the variable. Currently, it works only if variable is newly added.

``` shell
envar-cli add "SECRET_KEY=github" --comment "# SECRET KEYS"
#or
#with specific .env file --[extension]
envar-cli add "SECRET_KEY=google" --comment "# SECRET KEYS" --prod
```
#### Result:
**.env**:
``` txt
# SECRET KEYS
SECRET_KEY=github
```

**.env.prod**:
``` txt
# SECRET KEYS
SECRET_KEY=google
```

### Update Variable
To update a variable you can use **update** command.

``` shell
envar-cli update SECRET_KEY=github
#or
envar-cli update "SECRET_KEY=github"

#with specific .env file --[extension]
envar-cli update SECRET_KEY=github --prod
```

If variable not exists you will see a message like this:
**❗: <MY_VAR> not found in .env**

### Remove Variable
Deleting is also simple. Just use **remove** command.
And please:
* Write only variable name not with value.
* Pay attention to case sensitivity

``` shell
envar-cli remove SECRET_KEY
#or
envar-cli remove "SECRET_KEY"

#with specific .env file --[extension]
envar-cli remove SECRET_KEY --staging
```

### List Variables
To count and see your environment values please use **list** command.

``` shell
envar-cli list

#with specific .env file --[extension]
envar-cli list --development
```

#### Example Result:
``` txt
1. PORT=8080
2. SECRET_KEY=github
📄  : 2 variables found in .env
```