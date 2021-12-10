import { run } from "./scripts/run";
import * as readline from "readline";
import { readFileSync, existsSync } from "fs";

function red(txt: string): string {
    return `\x1b[31m${txt}\x1b[0m`;
}
function yellow(txt: string): string {
    return `\x1b[33m${txt}\x1b[0m`;
}
function cyan(txt: string): string {
    return `\x1b[36m${txt}\x1b[0m`;
}
function blue(txt: string): string {
    return `\x1b[34m${txt}\x1b[0m`;
}
function bold(txt: string): string {
    return `\x1b[1m${txt}\x1b[0m`;
}

let text = String.raw`
      ___           ___       ___     
     /\  \         /\__\     |\__\    
    /::\  \       /:/  /     |:|  |   
   /:/\:\  \     /:/  /      |:|  |   
  /::\~\:\  \   /:/  /       |:|__|__ 
 /:/\:\ \:\__\ /:/__/    ____/::::\__\
 \:\~\:\ \/__/ \:\  \    \::::/~~/~   
  \:\ \:\__\    \:\  \    ~~|:|~~|    
   \:\ \/__/     \:\  \     |:|  |    
    \:\__\        \:\__\    |:|  |    
     \/__/         \/__/     \|__|
`;

if (!process.argv.find((x) => x === "--no-banner")) {
    console.log(red(text));
    console.log(cyan("-".repeat(40)));
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const file = process.argv[2];
if (file) {
    if (!existsSync(file.trim())) {
        console.log(red(`File "${file}" not found`));
    } else {
        const inputFile = file.trim();
        const source = readFileSync(file.trim()).toString();

        run(inputFile, source);

        process.exit(0);
    }
} else {
    function input() {
        rl.question(cyan("elx -> "), (text) => {
            let inputFile = "<stdin>";
            let source = "";

            try {
                const inputFileToken = ">";
                if (text.toLowerCase().startsWith(inputFileToken)) {
                    const file = text.slice(inputFileToken.length + 1);
                    if (file.length <= 1) {
                        console.log(yellow("Please input a text file to run, '> index.elx'"));
                        input();
                    } else {
                        if (!existsSync(file.trim())) {
                            console.log(red("File not found"));
                            input();
                        } else {
                            inputFile = file.trim();
                            source = readFileSync(file.trim()).toString();
                        }
                    }
                } else {
                    source = text;
                }

                run(inputFile, source);
            } catch (error) {
                console.log((error as Error).message);
                // console.debug((error as Error).stack);
            }

            input();
        });
    }

    input();
}
