import {
    DebugLog,
    JetstreamSubscription,
    HandlerAgent,
    NewFollowerForUserValidator,
    InputContainsValidator,
    CreateSkeetHandler,
    MessageHandler, FunctionAction, JetstreamMessage
} from "bsky-event-handlers";

const testAgent = new HandlerAgent(
    'test-bot',
    <string>Bun.env.TEST_BSKY_HANDLE,
    <string>Bun.env.TEST_BSKY_PASSWORD
);

let jetstreamSubscription: JetstreamSubscription;

async function initialize() {
    await testAgent.authenticate()
    DebugLog.info("INIT", 'Initialized!')
    let handlers = {
        post: {
            c: [
                new CreateSkeetHandler(
                    [new InputContainsValidator("h")],
                    [new FunctionAction(( message: JetstreamMessage, agent: HandlerAgent) =>{
                        console.log("post");
                    })],
                    testAgent
                )
            ]
        },
        follow: {
            c: [
                new MessageHandler(
                    [new NewFollowerForUserValidator()],
                    [new FunctionAction(( message: JetstreamMessage, agent: HandlerAgent) =>{
                        console.log("New follower");
                    })],
                    testAgent
                )
            ]
        }
    }
    jetstreamSubscription = new JetstreamSubscription(
        handlers,
        "ws://localhost:6008/subscribe"
    );
}

initialize().then(() =>{
    jetstreamSubscription.createSubscription()
});


