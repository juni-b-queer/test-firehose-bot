import {InputStartsWithValidator, ReplyWithInputAction, LogRepoOperationAction, PostHandler} from "bsky-event-handlers";

export let TestHandler = new PostHandler(
    [new InputStartsWithValidator("he")],
    [new LogRepoOperationAction()],
    false
)

