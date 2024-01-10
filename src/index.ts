import {AppBskyFeedPost} from "@atproto/api";
import {
    ComAtprotoSyncSubscribeRepos,
    subscribeRepos,
    SubscribeReposMessage,
    XrpcEventStreamClient,
} from 'atproto-firehose'
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {
    HandlerController,
    AgentDetails,
    PostDetails,
    replyToPost,
    authenticateAgent,
    createAgent,
    debugLog
} from "bsky-event-handlers";
import {TestHandler} from "./TestHandler.ts";

let testAgentDetails: AgentDetails = {
    name: "test-bot",
    did: undefined,
    handle: <string>Bun.env.TEST_BSKY_HANDLE,
    password: <string>Bun.env.TEST_BSKY_PASSWORD,
    sessionData: undefined,
    agent: undefined
}

let testHandlerController: HandlerController;
let lastMessage = Date.now()

/**
 * Agent for reminders
 */
testAgentDetails = createAgent(testAgentDetails)


async function initialize() {

    // Here is where we're initializing the handler functions
    testAgentDetails = await authenticateAgent(testAgentDetails)
    if (!testAgentDetails.agent) {
        throw new Error(`Could not get agent from ${testAgentDetails.name}`)
    } else {
        testHandlerController = new HandlerController(testAgentDetails, [
            TestHandler
        ])
    }
    debugLog("INIT", 'Initialized!')
}

try {
    await initialize();
} catch (e) {
    setTimeout(async function () {
        await initialize()
    }, 30000)
}


/**
 * The client and listener for the firehose
 */
let firehoseClient = subscribeRepos(`wss://bsky.network`, {decodeRepoOps: true})

setFirehoseListener(firehoseClient)

function setFirehoseListener(firehoseClient: XrpcEventStreamClient) {
    firehoseClient.on('message', (m: SubscribeReposMessage) => {
        if (ComAtprotoSyncSubscribeRepos.isCommit(m)) {
            m.ops.forEach((op: RepoOp) => {
                // console.log(op)
                let payload = op.payload;
                lastMessage = Date.now()
                // @ts-ignore
                switch (payload?.$type) {
                    case 'app.bsky.feed.post':
                        if (AppBskyFeedPost.isRecord(payload)) {
                            let repo = m.repo;
                            if (payload.reply) {
                                testHandlerController.handle(op, repo)
                            }
                        }
                }
            })
        }
    })
}


let interval = 500
let MAX_TIME_BETWEEN = 100;
setInterval(async function () {
    let currentTime = Date.now();
    let diff = currentTime - lastMessage;
    debugLog('SCHEDULE', `Time since last received message: ${diff}`)
    // console.log(`Time since last received message: ${diff}`)
    if (diff > MAX_TIME_BETWEEN) {
        debugLog('SUBSCRIPTION', 'Restarting subscription')
        // console.log('Restarting subscription')
        firehoseClient.removeAllListeners();
        firehoseClient = subscribeRepos(`wss://bsky.network`, {decodeRepoOps: true})
        setFirehoseListener(firehoseClient)
        debugLog('SUBSCRIPTION', 'Subscription Restarted')
        // console.log('Subscription Restarted')
    }

}, 60 * interval)
