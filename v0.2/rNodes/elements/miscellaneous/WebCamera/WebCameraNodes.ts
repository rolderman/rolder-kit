import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import WebCamera_v0_1_0 from "./v0.1.0/WebCamera"

const { screenshot } = reactPorts.Data
const { screenshoted } = reactPorts.Signals

const nodeName = 'WebCamera'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: WebCamera_v0_1_0,
        outputs: { screenshot, screenshoted }
    },
}

const WebCameraNodes = getReactNodes(nodeName, nodeVersions)

export default WebCameraNodes