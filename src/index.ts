import {
    HandlerController,
    AgentDetails,
    PostDetails,
    replyToPost,
    authenticateAgent,
    createAgent,
    debugLog,
    FirehoseSubscription
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
testAgentDetails = createAgent(testAgentDetails)

let testHandlerController: HandlerController;

async function initialize() {
    testAgentDetails = await authenticateAgent(testAgentDetails)
    testHandlerController = new HandlerController(testAgentDetails, [
        TestHandler
    ], true)
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
const firehoseSubscription = new FirehoseSubscription([testHandlerController], 150);