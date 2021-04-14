#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const argvs = process.argv;

const currentCwd = process.cwd();
const ENV_PATH = path.resolve(currentCwd, ".env");

const ask = (questionText) => {
    return new Promise((resolve, reject) => {
        const _ask = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false,
        });
        _ask.question(questionText, (input) => resolve(input));
    });
}

const envExists = () => {
    try {
        const isExists = fs.existsSync(ENV_PATH);
        if (!isExists) {
            createEnv();
        }
        console.log("is file exists: " + isExists)
        return { data: isExists };
    } catch (e) {
        return { error: e.message }
    }
}

const createEnv = () => {
    try {
        const data = fs.openSync(ENV_PATH, "w");
        return { data };
    } catch (e) {
        return { error: e.message };
    }
}

const addVariable = async({ variable = null, value = null }) => {
    try {
        envExists();
        const status = await checkVariable({variable, value});
        if(status == false){
            fs.appendFileSync(ENV_PATH, `\n${variable}=${value}`);
            console.log(`RESULT: ${variable} added as a new variable`);
            process.exit();
        }
        console.log(`RESULT: ${variable} edited with ${value}`);
        process.exit();
    } catch (e) {
        return { error: e.message };
    }
}

const checkVariable = async ({ variable = null, value = null }) => {
    try {
        const envData = fs.readFileSync(ENV_PATH, "utf8");
        const splitted = envData.split("\n");
        const pattern = new RegExp(variable);
        let alreadyExists = false;
        for (let i = 0; i < splitted.length; i++) {
            const line = splitted[i];
            const split = line.split("=");
            if (split.length > 0) {
                if (split[0].match(pattern)) {
                    alreadyExists = true;
                    const answer = await ask(`${split[0]} already exits and it's value is ${split[1]} \n Continue? [Y/N]`);
                    if (answer == 'N') {
                        console.log('cmd will terminate');
                        process.exit(0);
                    }
                    if (answer == 'Y') {
                        console.log('we will continue to add');
                        const res = changeLine({ line: i, value: value });
                        fs.writeFileSync(ENV_PATH, res);
                        break;
                    }
                }
            }
        }
        return alreadyExists;
    } catch (e) {
        return { error: e.message };
    }
}

const changeLine = ({ line = null, value = "" }) => {
    const data = fs.readFileSync(ENV_PATH, "utf8");
    const lines = data.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const item = lines[i];
        if (i == line) {
            const splitItem = item.split("=");
            lines[i] = splitItem[0] + "=" + value;
        }
    }
    const result = lines.join("\n");
    return result;
}

addVariable({variable:'DATA', value:300});