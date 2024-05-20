import {
    CreateSkeetHandler,
    CreateSkeetMessage,
    DebugLog,
    FunctionAction,
    HandlerAgent,
    InputContainsValidator,
    JetstreamSubscription,
    LogMessageAction,
    ReplyingToBotValidator
} from 'bsky-event-handlers';
import * as console from "console";

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
                [new ReplyingToBotValidator()],
                [
                    new LogMessageAction(),
                    new CreateSkeetHandler(
                        [new InputContainsValidator("test")],
                        // @ts-ignore
                        [new FunctionAction((message: CreateSkeetMessage, handlerAgent: HandlerAgent) =>{
                            console.log("Test code");
                        })],
                        testAgent
                    )
                ],
                testAgent
            ),
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


