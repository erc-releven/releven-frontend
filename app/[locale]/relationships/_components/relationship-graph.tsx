"use client";

import "@xyflow/react/dist/style.css";

import {
	Background,
	BackgroundVariant,
	Controls,
	type Edge,
	Handle,
	type Node,
	type NodeProps,
	NodeToolbar,
	Position,
	ReactFlow,
	ReactFlowProvider,
	useNodesState,
	useReactFlow,
} from "@xyflow/react";
import {
	forceCenter,
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	type SimulationLinkDatum,
	type SimulationNodeDatum,
} from "d3-force";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

// — Exported types —

export interface GraphRelation {
	person: string;
	type: string;
	direction: "outgoing" | "incoming";
}

export interface GraphNode {
	id: string;
	x: number;
	y: number;
	relations: Array<GraphRelation>;
}

export interface EdgeAttestation {
	label: string;
	count: number;
	assertedBy: string;
	reference: string;
	sourcePassage: string;
}

export interface GraphEdge {
	id: string;
	source: string;
	target: string;
	totalCount: number;
	attestations: Array<EdgeAttestation>;
}

// — Internal types —

interface EdgeData extends Record<string, unknown> {
	totalCount: number;
	attestations: Array<EdgeAttestation>;
}

interface SimNode extends SimulationNodeDatum {
	id: string;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
	source: string | SimNode;
	target: string | SimNode;
}

interface HoveredEdge {
	data: EdgeData;
	x: number;
	y: number;
}

// — Node component —

const handleStyle = {
	opacity: 0,
	pointerEvents: "none" as const,
	width: 0,
	height: 0,
	minWidth: 0,
	minHeight: 0,
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
};

interface HoverState {
	hoveredId: string | null;
	highlightedIds: Set<string> | null;
}

const HoveredNodeIdContext = createContext<HoverState>({ hoveredId: null, highlightedIds: null });

function PointNode({ data, id }: Readonly<NodeProps>) {
	const { hoveredId, highlightedIds } = useContext(HoveredNodeIdContext);
	const relations = data.relations as Array<GraphRelation>;
	const isHighlighted = highlightedIds?.has(id) ?? false;
	return (
		<>
			<Handle isConnectable={false} position={Position.Top} style={handleStyle} type="target" />
			<Handle isConnectable={false} position={Position.Bottom} style={handleStyle} type="source" />
			<NodeToolbar isVisible={hoveredId === id} position={Position.Top}>
				<div
					className="w-72 rounded-2 border border-stroke-weak bg-background-base text-xs shadow-md"
					onWheel={(e) => {
						e.nativeEvent.stopPropagation();
					}}
				>
					<p className="border-b border-stroke-weak px-3 py-2 font-strong text-text-strong">
						{data.label as string}
					</p>
					{relations.length > 0 && (
						<>
							<p className="px-3 pt-2 pb-1 font-strong text-text-weak">{"Related persons"}</p>
							<div className="max-h-56 overflow-y-auto px-3 pb-3">
								<table className="w-full border-collapse">
									<tbody>
										{relations.map((r, i) => {
											return (
												<tr key={i}>
													<td className="py-0.5 pr-3 whitespace-nowrap text-text-weak">
														{r.direction === "outgoing" ? `${r.type} →` : `← ${r.type}`}
													</td>
													<td className="py-0.5 text-text-strong">{r.person}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</>
					)}
				</div>
			</NodeToolbar>
			<div
				className={`size-10 cursor-pointer rounded-full ring-2 ring-background-base ${isHighlighted ? "bg-secondary" : "bg-primary"}`}
			/>
		</>
	);
}

const nodeTypes = { point: PointNode };

// — Canvas —

interface RelationshipGraphProps {
	nodes: Array<GraphNode>;
	edges: Array<GraphEdge>;
}

interface FlowCanvasProps {
	graphNodes: Array<GraphNode>;
	graphEdges: Array<GraphEdge>;
}

function FlowCanvas({ graphNodes, graphEdges }: Readonly<FlowCanvasProps>) {
	const { setCenter } = useReactFlow();

	const [hoveredEdge, setHoveredEdge] = useState<HoveredEdge | null>(null);
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

	// Simulation refs — mutated in place, never cause re-renders
	const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null);
	const simNodeByIdRef = useRef<Map<string, SimNode>>(new Map());
	const draggingNodeIdRef = useRef<string | null>(null);
	// Tracks whether the mouse is inside the edge tooltip so we can keep it alive
	const isTooltipHoveredRef = useRef(false);

	const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
		graphNodes.map((n) => {
			return {
				id: n.id,
				type: "point",
				position: { x: n.x, y: n.y },
				data: { label: n.id, relations: n.relations },
				style: {
					background: "transparent",
					border: "none",
					padding: 0,
					width: "auto",
					height: "auto",
				},
			};
		}),
	);

	const edges = useMemo<Array<Edge>>(() => {
		return graphEdges.map((e) => {
			const strokeWidth = Math.max(1, Math.min(8, 1 + Math.log2(e.totalCount)));
			const opacity = Math.max(
				0.25,
				Math.min(1, 0.25 + (Math.log2(e.totalCount) / Math.log2(20)) * 0.75),
			);
			return {
				id: e.id,
				source: e.source,
				target: e.target,
				type: "straight",
				style: { strokeWidth, opacity, stroke: "#888" },
				interactionWidth: 20,
				data: { totalCount: e.totalCount, attestations: e.attestations },
			};
		});
	}, [graphEdges]);

	// Initialise simulation once on mount. The tick handler drives all position updates.
	useEffect(() => {
		const simNodes: Array<SimNode> = graphNodes.map((n) => {
			return { id: n.id, x: n.x, y: n.y };
		});
		const simLinks: Array<SimLink> = graphEdges.map((e) => {
			return { source: e.source, target: e.target };
		});
		simNodeByIdRef.current = new Map(
			simNodes.map((n) => {
				return [n.id, n];
			}),
		);

		simRef.current = forceSimulation<SimNode>(simNodes)
			.force(
				"link",
				forceLink<SimNode, SimLink>(simLinks)
					.id((d) => {
						return d.id;
					})
					.distance(120)
					.strength(0.3),
			)
			.force("charge", forceManyBody<SimNode>().strength(-250))
			.force("center", forceCenter(0, 0))
			.force("collide", forceCollide<SimNode>(55))
			.alpha(0.3) // start warm so the cooldown is visible on load
			.on("tick", () => {
				const byId = simNodeByIdRef.current;
				const draggingId = draggingNodeIdRef.current;
				setNodes((prev) => {
					return prev.map((n) => {
						if (n.id === draggingId) return n; // XYFlow owns the dragged node's position
						const sn = byId.get(n.id);
						if (!sn) return n;
						const nx = sn.x ?? n.position.x;
						const ny = sn.y ?? n.position.y;
						if (Math.abs(nx - n.position.x) < 0.5 && Math.abs(ny - n.position.y) < 0.5) return n;
						return { ...n, position: { x: nx, y: ny } };
					});
				});
			});

		return () => {
			simRef.current?.stop();
			simRef.current = null;
		};
		// graphNodes/graphEdges/setNodes are all stable for the lifetime of this component
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Drag: pin the node into the simulation so others react to it
	const onNodeDragStart = useCallback((_event: MouseEvent | TouchEvent, node: Node) => {
		draggingNodeIdRef.current = node.id;
		const sn = simNodeByIdRef.current.get(node.id);
		if (sn) {
			sn.fx = node.position.x;
			sn.fy = node.position.y;
		}
		simRef.current?.alphaTarget(0.3).restart();
	}, []);

	const onNodeDrag = useCallback((_event: MouseEvent | TouchEvent, node: Node) => {
		const sn = simNodeByIdRef.current.get(node.id);
		if (sn) {
			sn.fx = node.position.x;
			sn.fy = node.position.y;
		}
	}, []);

	const onNodeDragStop = useCallback((_event: MouseEvent | TouchEvent, node: Node) => {
		draggingNodeIdRef.current = null;
		const sn = simNodeByIdRef.current.get(node.id);
		if (sn) {
			sn.fx = null;
			sn.fy = null;
		}
		simRef.current?.alphaTarget(0); // let the simulation cool down
	}, []);

	// Click: pin the clicked node at the origin and reheat
	const handleNodeClick = useCallback(
		(_event: React.MouseEvent, clickedNode: Node) => {
			if (!simRef.current) return;
			for (const sn of simNodeByIdRef.current.values()) {
				sn.fx = null;
				sn.fy = null;
			}
			const clickedSn = simNodeByIdRef.current.get(clickedNode.id);
			if (clickedSn) {
				clickedSn.fx = 0;
				clickedSn.fy = 0;
			}
			simRef.current.alpha(0.8).alphaTarget(0).restart();
			void setCenter(0, 0, { zoom: 1, duration: 600 });
		},
		[setCenter],
	);

	const onEdgeMouseEnter = useCallback((event: React.MouseEvent, edge: Edge) => {
		setHoveredEdge({ data: edge.data as EdgeData, x: event.clientX, y: event.clientY });
	}, []);

	const onEdgeMouseLeave = useCallback(() => {
		if (!isTooltipHoveredRef.current) setHoveredEdge(null);
	}, []);

	const onNodeMouseEnter = useCallback((_event: React.MouseEvent, node: Node) => {
		setHoveredNodeId(node.id);
	}, []);

	const onNodeMouseLeave = useCallback(() => {
		setHoveredNodeId(null);
	}, []);

	const neighborMap = useMemo(() => {
		const map = new Map<string, Set<string>>();
		for (const e of graphEdges) {
			if (!map.has(e.source)) map.set(e.source, new Set());
			if (!map.has(e.target)) map.set(e.target, new Set());
			map.get(e.source)!.add(e.target);
			map.get(e.target)!.add(e.source);
		}
		return map;
	}, [graphEdges]);

	const hoverState = useMemo<HoverState>(() => {
		if (!hoveredNodeId) return { hoveredId: null, highlightedIds: null };
		const neighbors = neighborMap.get(hoveredNodeId) ?? new Set<string>();
		return { hoveredId: hoveredNodeId, highlightedIds: new Set([hoveredNodeId, ...neighbors]) };
	}, [hoveredNodeId, neighborMap]);

	return (
		<HoveredNodeIdContext value={hoverState}>
			<ReactFlow
				edges={edges}
				fitView={true}
				minZoom={0.02}
				nodeTypes={nodeTypes}
				nodes={nodes}
				nodesConnectable={false}
				onEdgeMouseEnter={onEdgeMouseEnter}
				onEdgeMouseLeave={onEdgeMouseLeave}
				onNodeClick={handleNodeClick}
				onNodeDrag={onNodeDrag}
				onNodeDragStart={onNodeDragStart}
				onNodeDragStop={onNodeDragStop}
				onNodeMouseEnter={onNodeMouseEnter}
				onNodeMouseLeave={onNodeMouseLeave}
				onNodesChange={onNodesChange}
				proOptions={{ hideAttribution: false }}
			>
				<Background gap={24} size={1} variant={BackgroundVariant.Dots} />
				<Controls />
			</ReactFlow>
			{hoveredEdge ? (
				<div
					className="fixed z-50 w-72 rounded-2 border border-stroke-weak bg-background-base text-xs shadow-md"
					onMouseEnter={() => {
						isTooltipHoveredRef.current = true;
					}}
					onMouseLeave={() => {
						isTooltipHoveredRef.current = false;
						setHoveredEdge(null);
					}}
					onWheel={(e) => {
						e.nativeEvent.stopPropagation();
					}}
					style={{
						left: hoveredEdge.x,
						top: hoveredEdge.y,
						transform: "translate(-50%, calc(-100% - 8px))",
					}}
				>
					{hoveredEdge.data.attestations.length > 1 && (
						<div className="border-b border-stroke-weak px-3 py-2">
							<p className="font-strong text-text-strong">
								{[
									...new Set(
										hoveredEdge.data.attestations.map((a) => {
											return a.label;
										}),
									),
								].join(" · ")}
							</p>
							<p className="text-text-weak">
								{"asserted "}
								<span className="tabular-nums">{hoveredEdge.data.attestations.length}</span>
								{" times · "}
								<span className="tabular-nums">{hoveredEdge.data.totalCount}</span>
								{" total result count"}
							</p>
						</div>
					)}
					<div className="max-h-80 overflow-y-auto p-3">
						{hoveredEdge.data.attestations.map((att, i) => {
							return (
								<div key={i}>
									{i > 0 && <hr className="my-2 border-stroke-weak" />}
									<dl className="grid gap-y-1">
										<dt className="font-strong text-text-weak">{"Relationship"}</dt>
										<dd className="text-text-strong">{att.label}</dd>
										<dt className="font-strong text-text-weak">{"Asserted by"}</dt>
										<dd className="text-text-strong">{att.assertedBy}</dd>
										<dt className="font-strong text-text-weak">{"Reference"}</dt>
										<dd className="text-text-strong">{att.reference}</dd>
										{att.sourcePassage ? (
											<>
												<dt className="font-strong text-text-weak">{"Source passage"}</dt>
												<dd className="font-mono text-text-strong">{att.sourcePassage}</dd>
											</>
										) : null}
										<dt className="font-strong text-text-weak">{"Result count"}</dt>
										<dd className="text-text-strong tabular-nums">{att.count}</dd>
									</dl>
								</div>
							);
						})}
					</div>
				</div>
			) : null}
		</HoveredNodeIdContext>
	);
}

export function RelationshipGraph(props: Readonly<RelationshipGraphProps>) {
	return (
		<ReactFlowProvider>
			<FlowCanvas graphEdges={props.edges} graphNodes={props.nodes} />
		</ReactFlowProvider>
	);
}
