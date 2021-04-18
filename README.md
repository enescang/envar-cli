## envar-cli
envar-cli is lightweight global package for managing .env variables using cli. You can add, remove or list .env variables. Just install and open terminal and type envar-cli --help to see what envar-cli can do.

## Install
``` shell
# with npm
npm install -g envar-cli
```

### Add Variable
If .env file is not exists **envar-cli** will create a blank .env file.

``` shell
envar-cli add "PORT=8080"
# or
envar-cli add PORT=8080
```

##### Result:
``` txt
PORT=8080
```

### Add Variable With Comment
If you want to add a comment to your .env file, please use **--comment** option. It will be add your comment line before the variable.

``` shell
envar-cli add "SECRET_KEY=github" --comment "# SECRET KEYS"
```
##### Result:
``` txt
# SECRET KEYS
SECRET_KEY=github
```
