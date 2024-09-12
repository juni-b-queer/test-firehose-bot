import {
    DebugLog,
    FunctionAction,
    HandlerAgent,
    InputContainsValidator,
    JetstreamSubscription,
    LogMessageAction, MessageHandler,
    ReplyingToBotValidator,
    CreateReskeetAction,
    DeleteReskeetAction,
    DeleteLikeAction,
    CreateLikeAction,
    IntervalSubscription,
    GoodBotHandler,
    ActionTakenByUserValidator,
    IntervalSubscriptionHandlers,
    AbstractHandler,
    OpenshockClient,
    OpenshockControlDeviceAction,
    LogInputTextAction
} from 'bsky-event-handlers';

const openshockClient = new OpenshockClient(<string>Bun.env.OPENSHOCK_API_TOKEN);


const testAgent = new HandlerAgent(
    'test-bot',
    <string>Bun.env.TEST_BSKY_HANDLE,
    <string>Bun.env.TEST_BSKY_PASSWORD
);

let jetstreamSubscription: JetstreamSubscription;

let handlers = {
    like: {
        c: [
            MessageHandler.make(
                [ActionTakenByUserValidator.make(<string>Bun.env.JUNI_DID)],
                [
                    LogInputTextAction.make("Vibrating"),
                    OpenshockControlDeviceAction.make(
                        openshockClient,
                        [<string>Bun.env.SHOCKER_ONE_ID, <string>Bun.env.SHOCKER_TWO_ID],
                        10,
                        1000,
                        'Vibrate'
                    )
                ],
                testAgent
            ),
        ],
        d: [
            MessageHandler.make(
                [ActionTakenByUserValidator.make(<string>Bun.env.JUNI_DID)],
                [
                    LogInputTextAction.make("Shocking"),
                    OpenshockControlDeviceAction.make(
                        openshockClient,
                        [<string>Bun.env.SHOCKER_TWO_ID],
                        10,
                        1000,
                        'Shock'
                    )
                ],
                testAgent
            ),
        ]
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


