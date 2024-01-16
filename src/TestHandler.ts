import {InputStartsWithValidator, ReplyWithInputAction, PostHandler} from "bsky-event-handlers";

export let TestHandler = new PostHandler(
    [new InputStartsWithValidator("Hello world!")],
    [new ReplyWithInputAction("Hi!")],
    false
)

