import {AbstractValidator, ValidatorInput} from "bsky-event-handlers";
export function isGoodBotResponse(input: string): boolean {
    const positiveConnotationWords: string[] = ["great", "good", "fantastic", "excellent", "awesome", "positive", "amazing", "incredible", "super"];
    const words = input.toLowerCase().split(" ");

    if (words[words.length - 1] === "bot") {
        for (const word of words) {
            if (positiveConnotationWords.includes(word)) {
                return true;
            }
        }
    }

    return false;
}
export class IsGoodBotValidator extends AbstractValidator {

    constructor() {
        super()
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        return isGoodBotResponse(this.getTextFromPost(validatorInput.op));
    }

}
