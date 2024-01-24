
type func = (left: boolean, right: boolean) => boolean

export class edge {
    node: node;
    evaluate: func;

    constructor(node: node, evaluate: func) {
        this.node = node
        this.evaluate = evaluate
    }
}

export class node {
    edges: edge[] = []
    update: Function;
    name: string = "undefined"

    newEdge(destination: node, evaluate: func) {
        this.edges.push(new edge(destination, evaluate))
    }

    constructor(update: Function) {
        this.update = update
    }
}

export class fsm {
    currentState: node
    nodes: node[]

    update(left: boolean, right: boolean) {
        let edge = this.currentState.edges.find((edge) => edge.evaluate(left, right))
        if (edge) {
            this.currentState = edge.node
        }
        this.currentState.update(left, right)
    }

    constructor(initState: node, ...nodes: node[]) {
        this.currentState = initState
        this.nodes = [initState, ...nodes]
    }
}