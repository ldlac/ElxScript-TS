import { internalRun } from "../../scripts/run";

export function runSample1() {
    const jsStartTime = performance.now();

    jsCase();

    console.log("Js Case", performance.now() - jsStartTime);

    console.log("-------------------");

    const elxStartTime = performance.now();

    elxCase();

    console.log("Elx Case", performance.now() - elxStartTime);
}

function jsCase() {
    //
}

function elxCase() {
    const program = `
        //
    `;

    internalRun(program);
}
