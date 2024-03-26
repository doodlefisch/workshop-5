import bodyParser from "body-parser";
import express from "express";
import { BASE_NODE_PORT } from "../config";
import {Value, NodeState} from "../types";
import {delay} from "../utils";

export async function node(
  nodeId: number, // the ID of the node
  N: number, // total number of nodes in the network
  F: number, // number of faulty nodes in the network
  initialValue: Value, // initial value of the node
  isFaulty: boolean, // true if the node is faulty, false otherwise
  nodesAreReady: () => boolean, // used to know if all nodes are ready to receive requests
  setNodeIsReady: (index: number) => void // this should be called when the node is started and ready to receive requests
) {
  const node = express();
  node.use(express.json());
  node.use(bodyParser.json());

  let currentState: NodeState = {
    killed: isFaulty,
    x: isFaulty ? null : initialValue,
    decided: isFaulty ? null : false,
    k: isFaulty ? null : 0
};

const incomingMessages: any[] = [];
let proposals: Map<number, Value[]> = new Map();
let votes: Map<number, Value[]> = new Map();

// Route to get the status of the node
node.get("/status", (req, res) => {
    if (currentState.killed) {
        res.status(500).send("faulty");
    } else {
        res.status(200).send("live");
    }
});

// TODO implement this
// this route allows the node to receive messages from other nodes


// TODO implement this
// this route is used to start the consensus algorithm

// this route is used to stop the consensus algorithm
node.get("/stop", async (req, res) => {
    currentState.killed = true;
    res.status(200).send("killed");
});

// Route to get the current state of the node
node.get("/getState", (req, res) => {
    res.status(200).send(currentState);
});



  // start the server
  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(
      `Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`
    );

    // the node is ready
    setNodeIsReady(nodeId);
  });

  return server;
}
