import {
    DebugLog,
    JetstreamSubscription,
    HandlerAgent,
    NewFollowerForUserValidator,
    CreateSkeetHandler,
    GoodBotHandler,
    MessageHandler, FunctionAction,LogMessageAction, JetstreamMessage, ReplyToSkeetAction, InputIsCommandValidator, InputContainsValidator
} from "bsky-event-handlers";

const testAgent = new HandlerAgent(
    'test-bot',
    <string>Bun.env.TEST_BSKY_HANDLE,
    <string>Bun.env.TEST_BSKY_PASSWORD
);

let jetstreamSubscription: JetstreamSubscription;

let handlers = {
    post: {
        c: [
            new CreateSkeetHandler(
                [new InputIsCommandValidator("plzwait")],
                [new LogMessageAction()],
                testAgent
            ),
            new CreateSkeetHandler(
                [new InputContainsValidator("hello")],
                [new LogMessageAction()],
                testAgent
            ),
            new GoodBotHandler(testAgent)
        ]
    },
    follow: {
        c: [
            new MessageHandler(
                [new NewFollowerForUserValidator(undefined)],
                [new FunctionAction(( message: JetstreamMessage, agent: HandlerAgent) =>{
                    console.log("New follower");
                })],
                testAgent
            )
        ]
    }
}

async function initialize() {
    await testAgent.authenticate()
    DebugLog.info("INIT", 'Initialized!')

    jetstreamSubscription = new JetstreamSubscription(
        handlers,
        <string>Bun.env.JETSTREAM_URL
    );
}

initialize().then(() =>{
    jetstreamSubscription.createSubscription()
});


