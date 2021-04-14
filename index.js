#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const argvs = process.argv;

const currentCwd = process.cwd();
const ENV_PATH = path.resolve(currentCwd, ".env");

console.log(ENV_PATH);

const envExists = async()=>{
    try {
        const isExists = await fs.existsSync(ENV_PATH);
        if(!isExists) {
            await createEnv();
        }
        console.log("is file exists: "+isExists)
        return { data: isExists };
    } catch(e) {
        return { error: e.message }
    }
}

const createEnv = async () =>{
    try {
        const data = await fs.openSync(ENV_PATH, "w");
        return { data };
    } catch(e) {
        return { error: e.message };
    }
}

const addVariable = async({variable=null, value=null})=>{
    try {
        await envExists();
        await fs.appendFileSync(ENV_PATH, `\n${variable}=${value}`)
    } catch(e) {
        return { error: e.message };
    }
}

addVariable({variable:'PORT', value:300});