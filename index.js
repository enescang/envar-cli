#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { ask, handleEnv, isCommentLine } = require("./utils");

const currentCwd = process.cwd();
let ENV_PATH = path.resolve(currentCwd, ".env");


const isEnvFileExists = () => {
    try {
        const isExists = fs.existsSync(ENV_PATH);
        if (!isExists) {
            createEnvFile();
        }
        console.log("is file exists: " + isExists)
        return { data: isExists };
    } catch (e) {
        return { error: e.message }
    }
}

const createEnvFile = () => {
    try {
        const data = fs.openSync(ENV_PATH, "w");
        return { data };
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

const checkVariable = async ({ variable = null, value = null }) => {
    try {
        const envData = fs.readFileSync(ENV_PATH, "utf8");
        const splitted = envData.split("\n");
        const pattern = new RegExp(variable);
        let alreadyExists = false;
        for (let i = 0; i < splitted.length; i++) {
            const line = splitted[i];
            const split = line.split("=");
            if (split[0].match(pattern)) {
                const { ENV_VAR, ENV_VAL } = handleEnv({str: line});
                alreadyExists = true;
                const answer = await ask(`${ENV_VAR} already exits and it's value is <${ENV_VAL}> \n Continue? [Y/N] `);
                if (answer.match(/n|no/i)) {
                    console.log('cmd will terminate');
                    process.exit(0);
                }
                if (answer.match(/y|yes/i)) {
                    console.log('we will continue to add');
                    const res = changeLine({ line: i, value: value });
                    fs.writeFileSync(ENV_PATH, res);
                    break;
                }
            }
        }
        return alreadyExists;
    } catch (e) {
        return { error: e.message };
    }
}

const addVariable = async ({ variable = null, value = null }) => {
    try {
        isEnvFileExists();
        const status = await checkVariable({ variable, value });
        if (status == false) {
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

const listEnvVariables = () => {
    isEnvFileExists();
    const envData = fs.readFileSync(ENV_PATH, "utf8");
    const lines = envData.split("\n");
    for (let i=0; i<lines.length; i++){
        const line = lines[i];
        const isComment = isCommentLine({str: line});
        if (line != "" && isComment == false){
            console.log(`${i}. ${line}`);
        }
    }
}

const start = () => {
    try {
        const argvs = process.argv;
        const command = argvs[2];

        switch (command) {
            case "add":
                const { ENV_VAR, ENV_VAL } = handleEnv({ str: argvs[3] });
                addVariable({ variable: ENV_VAR, value: ENV_VAL });
                break;
            case "remove":
                console.log("TODO: Delete env var");
                break;
            case "list":
                console.log("TODO: List all of env variables");
                listEnvVariables();
                break;
        }
    } catch (e) {
        console.error(e);
    }

}

start();
