import {
    DebugLog,
    JetstreamSubscription,
    HandlerAgent,
    NewFollowerForUserValidator,
    CreateSkeetAction,
    MessageHandler
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
        follow:{
            c: [
                new MessageHandler(
                    [new NewFollowerForUserValidator()],
                    [new CreateSkeetAction("New Follower!")],
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

initialize();


