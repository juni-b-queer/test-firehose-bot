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
    IsFourTwentyValidator,
    LogInputTextAction,
    CreateSkeetAction
} from 'bsky-event-handlers';
import * as console from "console";



const testAgent = new HandlerAgent(
    'test-bot',
    <string>Bun.env.IS_IT_FOUR_TWENTY_HANDLE,
    <string>Bun.env.IS_IT_FOUR_TWENTY_PASSWORD
);


let intervalSubscription: IntervalSubscription;
const intervalSubscriptionHandlers: IntervalSubscriptionHandlers = [
    {
        intervalSeconds: 60,
        handlers:[
            new AbstractHandler(
                [IsFourTwentyValidator.make()],
                [
                    LogInputTextAction.make("Is 4:20"),
                    CreateSkeetAction.make("It's 4:20 somewhere!")
                ],
                testAgent),
            new AbstractHandler(
                [IsFourTwentyValidator.make().not()],
                [
                    LogInputTextAction.make("Is not 4:20"),
                    CreateSkeetAction.make("It's not 4:20 anywhere :(")

                ],
                testAgent)
        ]
    }
]

await testAgent.authenticate()
DebugLog.info("INIT", 'Initialized!')

intervalSubscription = new IntervalSubscription(
    intervalSubscriptionHandlers
)

intervalSubscription.createSubscription()




