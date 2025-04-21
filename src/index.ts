import {
    CreateLikeAction,
    CreateSkeetAction,
    DebugLog, DebugLogAction,
    HandlerAgent,
    InputIsCommandValidator,
    JetstreamEventCommit,
    JetstreamSubscription, LogInputTextAction,
    MessageHandler, TestValidator
} from 'bsky-event-handlers';
process.on('SIGINT', () => {
    console.log('Received SIGINT signal, shutting down gracefully...');
    // Perform cleanup tasks here
    process.exit(0);
});
const testAgent = new HandlerAgent(
    'test-bot',
    <string>Bun.env.TEST_BSKY_HANDLE,
    <string>Bun.env.TEST_BSKY_PASSWORD
);

let jetstreamSubscription: JetstreamSubscription;

// @ts-ignore
let handlers = {
    post: {
        c: [
            MessageHandler.make(
                [
                    // InputIsCommandValidator.make('dontbreak')
                    InputIsCommandValidator.make('dontbreak'),
                    TestValidator.make(true)
                ],
                [
                    LogInputTextAction.make('text')
                ],
                testAgent
            ),
        ],
    },
    like: {
        c: [
            MessageHandler.make(
                [
                    TestValidator.make(false)
                ],
                [
                    LogInputTextAction.make('text')
                ],
                testAgent
            ),
        ],
    },

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


