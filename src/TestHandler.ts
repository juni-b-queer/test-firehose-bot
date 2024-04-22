import {
    ReplyWithInputAction,
    PostHandler,
    InputIsCommandValidator,
    AgentDetails,
    PostDetails,
    getHumanReadableDateTimeStamp, FunctionAction, ReplyWithGeneratedTextAction, debugLog, HandlerAgent
} from "bsky-event-handlers";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {extractTimeFromInput, extractTimezone, extractTimezoneAbbreviation} from "time-decoding-utils";

const COMMAND = "breakjuni"

export class TestHandler extends PostHandler {
    constructor(public handlerAgent: HandlerAgent, private command: string) {
        super(
            [new InputIsCommandValidator(command, false)],
            [
                new FunctionAction(timestampMakerFunction),
                new ReplyWithGeneratedTextAction(timestampMakerFunction)
            ],
            handlerAgent,
        );
    }

    async handle(
        op: RepoOp,
        repo: string,
    ): Promise<void> {
        return super.handle(op, repo);
    }
}



function timestampMakerFunction(handlerAgent: HandlerAgent, op: RepoOp, postDetails: PostDetails){
    let inputText = op.payload.text;
    let output = "";
    console.log(`input: ${inputText}`)
    let iso = extractTimeFromInput(inputText)
    if(iso !== ""){
        let timezone: string;
        let timezoneAbbreviation: string;
        let extractedTimezone = extractTimezone(inputText)
        let extractedAbbreviatedTimezone = extractTimezoneAbbreviation(inputText);
        if(typeof extractedTimezone !== "boolean"){
            timezone = extractedTimezone
            if(typeof extractedAbbreviatedTimezone !== "boolean"){
                timezoneAbbreviation = extractedAbbreviatedTimezone;
            }else{
                timezoneAbbreviation = timezone
            }
        }else{
            timezone = "America/Chicago"
            timezoneAbbreviation = "CT"
        }
        console.log(iso)
        console.log(timezone)
        let humanReadable = getHumanReadableDateTimeStamp(iso, timezone)
        console.log(humanReadable)
        output = `The ISO timestamp is ${iso}, and the Human readable timestamp is ${humanReadable} ${timezoneAbbreviation}`;
    }else{
        debugLog("BAD INPUT", inputText);
        console.log("No time in input")
        output = "No time found in input"
    }
    console.log(output)
    return output;

}


