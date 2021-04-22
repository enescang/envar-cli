#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { ask, handleEnv, isCommentLine } = require("./utils");

const currentCwd = process.cwd();
let ENV_PATH = path.resolve(currentCwd, ".env");
const ENV_TYPES = ["example", "local", "dev", "development", "prod", "production", "staging", "preview"];
let extension = "";
const argvs = process.argv;


const getExtension = () => {
    return extension != "" ? `.env.${extension}` : ".env";
}

const isEnvFileExists = ({ create = true }) => {
    try {
        const isExists = fs.existsSync(ENV_PATH);
        if (isExists == false) {
            console.log(`${getExtension()} does not exists.`);
            if (create == true) {
                createEnvFile();
            }
            return { data: false };
        }
        return { data: true };
    } catch (e) {
        return { error: e.message }
    }
}

const createEnvFile = () => {
    try {
        const data = fs.openSync(ENV_PATH, "w");
        console.log(`Created ${getExtension()} file`);
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
    fs.writeFileSync(ENV_PATH, result);
    return result;
}

const removeEnvVariable = ({ variable = null }) => {
    const { data, error } = isEnvFileExists({ create: false });
    if (data == false) {
        return;
    }
    const envData = fs.readFileSync(ENV_PATH, "utf8");
    let lines = envData.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const splitted = line.split("=");
        const isEnvMatch = splitted[0] == variable;
        if (isCommentLine({ str: line }) == false && isEnvMatch == true) {
            lines.splice(i, 1);
            break;
        }
        //If variable not found
        if (i == lines.length - 1) {
            console.log(`Could not found ${variable} on ${ENV_PATH}`);
            console.log(`Please make sure to pay attention to case sensitivity.`);
        }
    }
    const result = lines.join("\n");
    fs.writeFileSync(ENV_PATH, result);
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
                const { ENV_VAR, ENV_VAL } = handleEnv({ str: line });
                alreadyExists = true;
                const answer = await ask(`<${ENV_VAR}> already exits and it's value is <${ENV_VAL}> \n Continue? [Y/N] `);
                if (answer.match(/n|no/i)) {
                    console.log('cmd will terminate');
                    process.exit(0);
                }
                if (answer.match(/y|yes/i)) {
                    console.log('we will continue to add');
                    changeLine({ line: i, value: value });
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
        isEnvFileExists({ create: true });
        if (isCommentLine({ str: variable }) || isCommentLine({ str: value })) {
            console.log(`Your value looks like a comment line`);
            console.log(`Please use --comment option to add comment`);
            process.exit();
        }
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
    isEnvFileExists({ create: false });
    const envData = fs.readFileSync(ENV_PATH, "utf8");
    const lines = envData.split("\n");
    let count = 1;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isComment = isCommentLine({ str: line });
        const splitted = line.split("=");
        if (line != "" && isComment == false && splitted.length > 1) {
            console.log(`${count}. ${line}`);
            count++;
        }
    }
    console.log(`RESULT: ${count -1 } variables found in ${getExtension()}`)
}

const commentLineOption = () => {
    const command = argvs[4];
    if (command == '--comment') {
        const commentVal = argvs[5];
        if (isCommentLine({ str: commentVal })) {
            fs.appendFileSync(ENV_PATH, `\n${commentVal}`);
        } else {
            console.log(`<${commentVal}> is not a comment line`);
            console.log(`It must starts with "#"`);
        }
    }
}

/**
 * Types can be:
 * example
 * local
 * dev
 * development
 * prod
 * production
 * staging
 * preview
 */
const envFileType = () => {
    const lastArgv = argvs[argvs.length - 1];
    const clearArgv = lastArgv.replace(/-/g, "");
    const envTypeIndex = ENV_TYPES.indexOf(clearArgv);
    if (envTypeIndex > -1) {
        extension = ENV_TYPES[envTypeIndex];
        ENV_PATH += "." + extension;
    }
    return true;
}

const start = () => {
    try {
        const command = argvs[2];
        envFileType();
        commentLineOption();
        switch (command) {
            case "add":
                const { ENV_VAR, ENV_VAL } = handleEnv({ str: argvs[3] });
                addVariable({ variable: ENV_VAR, value: ENV_VAL });
                break;
            case "remove":
                removeEnvVariable({ variable: argvs[3] });
                break;
            case "list":
                listEnvVariables();
                break;
        }
    } catch (e) {
        console.error(e.message);
    }

}

start();
