import {PostHandler, LogInputTextAction, LogPostDetailsAction, LogRepoOperationAction, InputStartsWithValidator, ReplyingToBotValidator, ReplyWithInputAction} from "bsky-event-handlers";
import {IsGoodBotValidator} from "./utils/text-utils.ts";

export let TestHandler = new PostHandler(
    [new IsGoodBotValidator(), new ReplyingToBotValidator()],
    [new ReplyWithInputAction("Thank you 🥹")],
    false
)