import {
    DebugLog,
    HandlerAgent,
    InputIsCommandValidator,
    IsNewPost,
    JetstreamSubscription,
    LogMessageAction,
    TestValidator,
    MessageHandler,
    LogInputTextAction,
    SimpleFunctionValidator,
    JetstreamEventCommit
} from 'bsky-event-handlers';


const testAgent = new HandlerAgent(
    'test-bot',
    <string>Bun.env.TEST_BSKY_HANDLE,
    <string>Bun.env.TEST_BSKY_PASSWORD
);

let jetstreamSubscription: JetstreamSubscription;

let a = {
    post: {
        c: 0,
        d: 0
    },
    like: {
        c: 0,
        d: 0
    },
    follow: {
        c: 0,
        d: 0
    },
    repost: {
        c: 0,
        d: 0
    }
}
console.log(a);
let handlers = {
    // post: {
    //     c: [
    //         MessageHandler.make(
    //             [
    //                 // InputIsCommandValidator.make('dontbreak')
    //                 SimpleFunctionValidator.make((handlerAgent: HandlerAgent, eventCommit: JetstreamEventCommit) => {
    //                     if(a.post.c == 0){
    //                             a.post.c = 1;
    //                             return true;
    //                     }else{
    //                         return false;
    //                     }
    //                 })
    //             ],
    //             [
    //                 LogMessageAction.make(),
    //             ],
    //             testAgent
    //         ),
    //     ],
    //     d: [
    //         MessageHandler.make(
    //             [
    //                 // InputIsCommandValidator.make('dontbreak')
    //                 SimpleFunctionValidator.make((handlerAgent: HandlerAgent, eventCommit: JetstreamEventCommit) => {
    //                     if(a.post.d == 0){
    //                         a.post.d = 1;
    //                         return true;
    //                     }
    //                 })
    //             ],
    //             [
    //                 LogMessageAction.make(),
    //             ],
    //             testAgent
    //         ),
    //     ],
    // },
    like: {
        c: [
            MessageHandler.make(
                [
                    // InputIsCommandValidator.make('dontbreak')
                    SimpleFunctionValidator.make((handlerAgent: HandlerAgent, eventCommit: JetstreamEventCommit) => {
                        if(a.like.c == 0){
                            if(eventCommit.commit?.record?.subject){
                                a.like.c = 1;
                                console.log(eventCommit.commit?.record?.subject)
                                return true;
                            }
                            return false;
                        }
                    })
                ],
                [
                    LogMessageAction.make(),
                ],
                testAgent
            ),
        ],
        // d: [
        //     MessageHandler.make(
        //         [
        //             // InputIsCommandValidator.make('dontbreak')
        //             SimpleFunctionValidator.make((handlerAgent: HandlerAgent, eventCommit: JetstreamEventCommit) => {
        //                 if(a.like.d == 0){
        //                     a.like.d = 1;
        //                     return true;
        //                 }
        //             })
        //         ],
        //         [
        //             LogMessageAction.make(),
        //         ],
        //         testAgent
        //     ),
        // ],
    },
    // follow: {
    //     c: [
    //         MessageHandler.make(
    //             [
    //                 // InputIsCommandValidator.make('dontbreak')
    //                 SimpleFunctionValidator.make((handlerAgent: HandlerAgent, eventCommit: JetstreamEventCommit) => {
    //                     if(a.follow.c == 0){
    //                         a.follow.c = 1;
    //                         return true;
    //                     }
    //                 })
    //             ],
    //             [
    //                 LogMessageAction.make(),
    //             ],
    //             testAgent
    //         ),
    //     ],
    //     d: [
    //         MessageHandler.make(
    //             [
    //                 // InputIsCommandValidator.make('dontbreak')
    //                 SimpleFunctionValidator.make((handlerAgent: HandlerAgent, eventCommit: JetstreamEventCommit) => {
    //                     if(a.follow.d == 0){
    //                         a.follow.d = 1;
    //                         return true;
    //                     }
    //                 })
    //             ],
    //             [
    //                 LogMessageAction.make(),
    //             ],
    //             testAgent
    //         ),
    //     ],
    // },
    repost: {
        c: [
            MessageHandler.make(
                [
                    // InputIsCommandValidator.make('dontbreak')
                    SimpleFunctionValidator.make((handlerAgent: HandlerAgent, eventCommit: JetstreamEventCommit) => {
                        if(a.repost.c == 0){
                            if(eventCommit.commit?.record?.subject){
                                a.repost.c = 1;
                                console.log(eventCommit.commit?.record?.subject)
                                return true;
                            }
                            return false;
                        }
                    })
                ],
                [
                    LogMessageAction.make(),
                ],
                testAgent
            ),
        ],
        // d: [
        //     MessageHandler.make(
        //         [
        //             // InputIsCommandValidator.make('dontbreak')
        //             SimpleFunctionValidator.make((handlerAgent: HandlerAgent, eventCommit: JetstreamEventCommit) => {
        //                 if(a.repost.d == 0){
        //                     a.repost.d = 1;
        //                     return true;
        //                 }
        //             })
        //         ],
        //         [
        //             LogMessageAction.make(),
        //         ],
        //         testAgent
        //     ),
        // ],
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


