import { internalRun } from "../../run";

jest.spyOn(console, "time").mockImplementation(() => {});
jest.spyOn(console, "timeEnd").mockImplementation(() => {});

describe("Interprete programs", () => {
    it("should be able to interprete fizz buzz 15", () => {
        const program = `
            @constants = { values: [1..15], fizz: { name: "FIZZ" } }

            @fizz_buzz = (nums) => {
                nums.for(b => b)
                nums.map((i) => {
                    @fizz_filter = (output) => ifelse(i % 3 == 0, output + constants.fizz.name, output)
                    @buzz_filter = (output) => ifelse(i % 5 == 0, output + "BUZZ", output)
                    @final_filter = (output) => output || i

                    "" |> fizz_filter |> buzz_filter |> final_filter
                }).map((a) => a).map((a) => a)
            }

            fizz_buzz(constants.values)
        `;

        const lastInstruction = internalRun(program);

        expect(lastInstruction).toEqual([
            1,
            2,
            "FIZZ",
            4,
            "BUZZ",
            "FIZZ",
            7,
            8,
            "FIZZ",
            "BUZZ",
            11,
            "FIZZ",
            13,
            14,
            "FIZZBUZZ",
        ]);
    });

    it.each([
        ["Array length", `#[1]`, 1],
        ["String length", `#"12"`, 2],
        ["Object length", `#{a:1}`, undefined],
        ["Number length", `#1`, undefined],
        ["Function length", `#(() => {})`, undefined],
        ["RegExp length", `#/\n/`, undefined],
        ["Boolean true length", `#true`, undefined],
        ["Boolean false length", `#false`, undefined],
    ])("should %s", (name: string, program: string, expected: any) => {
        const lastInstruction = internalRun(program);

        expect(lastInstruction).toEqual(expected);
    });
});

describe("Length operator", () => {
    it.each([
        ["Array length", `#[1]`, 1],
        ["String length", `#"12"`, 2],
        ["Object length", `#{a:1}`, undefined],
        ["Number length", `#1`, undefined],
        ["Function length", `#(() => {})`, undefined],
        ["RegExp length", `#/\n/`, undefined],
        ["Boolean true length", `#true`, undefined],
        ["Boolean false length", `#false`, undefined],
    ])("should %s", (name: string, program: string, expected: any) => {
        const lastInstruction = internalRun(program);

        expect(lastInstruction).toEqual(expected);
    });
});

describe("misc", () => {
    it.each([["Object spread", `@a = {a:1,b:(s)=>{1}}; @b={...a}; b.b()`, 1]])(
        "should %s",
        (name: string, program: string, expected: any) => {
            const lastInstruction = internalRun(program);

            expect(lastInstruction).toEqual(expected);
        }
    );
});
