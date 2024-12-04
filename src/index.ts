import {
    CreateLikeAction,
    CreateSkeetAction,
    DebugLog,
    HandlerAgent,
    InputIsCommandValidator,
    JetstreamEventCommit,
    JetstreamSubscription,
    MessageHandler
} from 'bsky-event-handlers';


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
                ],
                [
                    CreateLikeAction.make(MessageHandler.getUriFromMessage, MessageHandler.getCidFromMessage),
                    CreateSkeetAction.make((handler: HandlerAgent, event: JetstreamEventCommit): string =>{
                        if(!event.commit.record?.createdAt) return "No timestamp";

                        return event.commit.record?.createdAt;
                    },
                        MessageHandler.generateReplyFromMessage)

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


