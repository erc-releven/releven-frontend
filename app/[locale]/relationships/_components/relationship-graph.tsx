"use client";

import {
	forceCollide,
	type ForceLink,
	type ForceManyBody,
	type SimulationLinkDatum,
} from "d3-force";
import dynamic from "next/dynamic";
import {
	type ComponentType,
	type RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type {
	ForceGraphMethods,
	ForceGraphProps,
	LinkObject,
	NodeObject,
} from "react-force-graph-2d";

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

interface FGNodeData {
	relations: Array<GraphRelation>;
}

interface FGLinkData {
	totalCount: number;
	attestations: Array<EdgeAttestation>;
}

const ForceGraph2D = dynamic(
	() => {
		return import("react-force-graph-2d");
	},
	{ ssr: false },
) as ComponentType<
	ForceGraphProps<FGNodeData, FGLinkData> & {
		ref?: RefObject<ForceGraphMethods<FGNodeData, FGLinkData> | undefined>;
	}
>;

interface SelectedNode {
	id: string;
	x: number;
	y: number;
}

interface SelectedEdge {
	data: FGLinkData;
	source: string;
	target: string;
	x: number;
	y: number;
}

interface Rect {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

function rectsOverlap(a: Rect, b: Rect): boolean {
	return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
}

const NODE_RADIUS = 20;
const LABEL_FONT_SIZE = 12;
const LABEL_MIN_SCREEN_RADIUS = 3;

interface RelationshipGraphProps {
	nodes: Array<GraphNode>;
	edges: Array<GraphEdge>;
}

export function RelationshipGraph(props: Readonly<RelationshipGraphProps>) {
	const { edges: graphEdges, nodes: graphNodes } = props;

	const fgRef = useRef<ForceGraphMethods<FGNodeData, FGLinkData> | undefined>(undefined);
	const containerRef = useRef<HTMLDivElement>(null);
	const hasInitializedRef = useRef(false);
	// Bounding boxes of labels already drawn in the current frame — reset every frame, used to
	// skip a label when it would overlap one already placed.
	const labelRectsRef = useRef<Array<Rect>>([]);

	const [size, setSize] = useState({ width: 0, height: 0 });
	// Drives the neighbor highlight — still hover-driven.
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
	// Drives the tooltips — click-driven; cleared by clicking the background or the other kind.
	const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
	const [selectedEdge, setSelectedEdge] = useState<SelectedEdge | null>(null);
	// Track hovered edge for visual feedback
	const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

	// Canvas fillStyle can't resolve CSS custom properties, so the design tokens are read once
	// here. This subtree only ever mounts on the client (see the ssr:false dynamic import above).
	const [colors] = useState(() => {
		const style = getComputedStyle(document.documentElement);
		return {
			primary: style.getPropertyValue("--color-primary").trim(),
			secondary: style.getPropertyValue("--color-secondary").trim(),
			backgroundBase: style.getPropertyValue("--color-background-base").trim(),
			textStrong: style.getPropertyValue("--color-text-strong").trim(),
		};
	});

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			const { width, height } = entry.contentRect;
			setSize({ width, height });
		});
		observer.observe(el);
		return () => {
			observer.disconnect();
		};
	}, []);

	// Runs once, on the first simulation tick — by then the lazily-loaded ForceGraph2D instance
	// is guaranteed to be mounted and `fgRef.current` populated, unlike a mount-time effect, whose
	// timing relative to the dynamic import isn't guaranteed.
	const onEngineTick = useCallback(() => {
		if (hasInitializedRef.current) return;
		hasInitializedRef.current = true;
		const fg = fgRef.current;
		if (!fg) return;
		(
			fg.d3Force("link") as
				| ForceLink<NodeObject<FGNodeData>, SimulationLinkDatum<NodeObject<FGNodeData>>>
				| undefined
		)
			?.distance(120)
			.strength(0.3);
		(fg.d3Force("charge") as ForceManyBody<NodeObject<FGNodeData>> | undefined)?.strength(-250);
		fg.d3Force("collide", forceCollide<NodeObject<FGNodeData>>(55));
		fg.zoomToFit(0, 40);
	}, []);

	const nodeById = useMemo(() => {
		const map = new Map<string, GraphNode>();
		for (const n of graphNodes) map.set(n.id, n);
		return map;
	}, [graphNodes]);

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

	const highlightedIds = useMemo(() => {
		if (!hoveredNodeId) return null;
		const neighbors = neighborMap.get(hoveredNodeId) ?? new Set<string>();
		return new Set([hoveredNodeId, ...neighbors]);
	}, [hoveredNodeId, neighborMap]);

	// Stable across re-renders — force-graph mutates these objects in place (e.g. it replaces a
	// link's source/target id with the resolved node object), so this must only be recomputed
	// when the underlying data actually changes, not on every hover-driven render.
	// x/y seed the simulation from the server-computed layout instead of a random scatter; they
	// aren't pinned (no fx/fy), so the force engine is free to keep moving nodes from there.
	const graphData = useMemo(() => {
		const nodes: Array<NodeObject<FGNodeData>> = graphNodes.map((n) => {
			return { id: n.id, x: n.x, y: n.y, relations: n.relations };
		});
		const links: Array<LinkObject<FGNodeData, FGLinkData>> = graphEdges.map((e) => {
			return {
				id: e.id,
				source: e.source,
				target: e.target,
				totalCount: e.totalCount,
				attestations: e.attestations,
			};
		});
		return { nodes, links };
	}, [graphNodes, graphEdges]);

	// Click: center the camera on the clicked node, open its tooltip, keep the layout as-is
	const onNodeClick = useCallback((node: NodeObject<FGNodeData>, event: MouseEvent) => {
		if (node.x === undefined || node.y === undefined) return;
		fgRef.current?.centerAt(node.x, node.y, 600);
		fgRef.current?.zoom(1, 600);
		setSelectedEdge(null);
		setSelectedNode({ id: node.id as string, x: event.clientX, y: event.clientY });
	}, []);

	const onLinkClick = useCallback((link: LinkObject<FGNodeData, FGLinkData>, event: MouseEvent) => {
		setSelectedNode(null);
		const sourceId =
			typeof link.source === "string" ? link.source : (link.source as NodeObject<FGNodeData>).id;
		const targetId =
			typeof link.target === "string" ? link.target : (link.target as NodeObject<FGNodeData>).id;
		setSelectedEdge({
			data: { totalCount: link.totalCount, attestations: link.attestations },
			source: sourceId as string,
			target: targetId as string,
			x: event.clientX,
			y: event.clientY,
		});
	}, []);

	const onBackgroundClick = useCallback(() => {
		setSelectedNode(null);
		setSelectedEdge(null);
	}, []);

	const onNodeHover = useCallback((node: NodeObject<FGNodeData> | null) => {
		setHoveredNodeId(node ? (node.id as string) : null);
	}, []);

	const onLinkHover = useCallback((link: LinkObject<FGNodeData, FGLinkData> | null) => {
		setHoveredEdgeId(link ? (link.id as string) : null);
	}, []);

	const onRenderFramePre = useCallback(() => {
		labelRectsRef.current = [];
	}, []);

	const nodeCanvasObject = useCallback(
		(node: NodeObject<FGNodeData>, ctx: CanvasRenderingContext2D, globalScale: number) => {
			const x = node.x ?? 0;
			const y = node.y ?? 0;
			const nodeId = node.id as string;
			const isHighlighted = highlightedIds?.has(nodeId) ?? false;
			const isSelected = selectedNode?.id === nodeId;
			const isConnectedToSelectedEdge =
				selectedEdge && (selectedEdge.source === nodeId || selectedEdge.target === nodeId);

			ctx.beginPath();
			ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
			let fillColor = colors.primary;
			if (isSelected) {
				fillColor = "#ef4444";
			} else if (isConnectedToSelectedEdge || isHighlighted) {
				fillColor = colors.secondary;
			}
			ctx.fillStyle = fillColor;
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = colors.backgroundBase;
			ctx.stroke();

			// Skip the label once the node itself renders too small to read next to anyway.
			if (NODE_RADIUS * globalScale < LABEL_MIN_SCREEN_RADIUS) return;

			const fontSize = LABEL_FONT_SIZE / globalScale;
			ctx.font = `${String(fontSize)}px sans-serif`;
			const label = node.id as string;
			const padding = 4 / globalScale;
			const labelX = x + NODE_RADIUS + padding;
			const rect: Rect = {
				x1: labelX,
				y1: y - fontSize / 2,
				x2: labelX + ctx.measureText(label).width,
				y2: y + fontSize / 2,
			};
			// Skip the label if it would overlap one already placed this frame — first node in
			// graphData order wins, so the same labels tend to stay visible from frame to frame.
			if (
				labelRectsRef.current.some((placed) => {
					return rectsOverlap(placed, rect);
				})
			)
				return;
			labelRectsRef.current.push(rect);

			ctx.fillStyle = colors.textStrong;
			ctx.textAlign = "left";
			ctx.textBaseline = "middle";
			ctx.fillText(label, labelX, y);
		},
		[highlightedIds, colors, selectedNode, selectedEdge],
	);

	const nodePointerAreaPaint = useCallback(
		(node: NodeObject<FGNodeData>, color: string, ctx: CanvasRenderingContext2D) => {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(node.x ?? 0, node.y ?? 0, NODE_RADIUS, 0, 2 * Math.PI);
			ctx.fill();
		},
		[],
	);

	const linkWidth = useCallback((link: LinkObject<FGNodeData, FGLinkData>) => {
		return Math.max(1, Math.min(8, 1 + Math.log2(link.totalCount)));
	}, []);

	const linkColor = useCallback(
		(link: LinkObject<FGNodeData, FGLinkData>) => {
			const totalCount: number = link.totalCount;
			const isSelected = selectedEdge?.data.attestations === link.attestations;
			const isHovered = hoveredEdgeId === (link.id as string);

			let baseColor = "136, 136, 136";
			if (isSelected) {
				baseColor = "239, 68, 68";
			} else if (isHovered) {
				baseColor = "100, 100, 100";
			}

			const opacity = Math.max(
				0.25,
				Math.min(1, 0.25 + (Math.log2(totalCount) / Math.log2(20)) * 0.75),
			);
			return `rgba(${baseColor}, ${String(Math.max(opacity, isSelected || isHovered ? 0.8 : opacity))})`;
		},
		[selectedEdge, hoveredEdgeId],
	);

	const selectedGraphNode = selectedNode ? nodeById.get(selectedNode.id) : undefined;

	return (
		<div ref={containerRef} className="relative size-full">
			{size.width > 0 && size.height > 0 ? (
				<ForceGraph2D
					ref={fgRef}
					graphData={graphData}
					height={size.height}
					linkColor={linkColor}
					linkHoverPrecision={8}
					linkWidth={linkWidth}
					minZoom={0.02}
					nodeCanvasObject={nodeCanvasObject}
					nodePointerAreaPaint={nodePointerAreaPaint}
					onBackgroundClick={onBackgroundClick}
					onEngineTick={onEngineTick}
					onLinkClick={onLinkClick}
					onLinkHover={onLinkHover}
					onNodeClick={onNodeClick}
					onNodeHover={onNodeHover}
					onRenderFramePre={onRenderFramePre}
					width={size.width}
				/>
			) : null}
			{selectedNode && selectedGraphNode ? (
				<div
					className="absolute top-4 right-4 z-50 w-72 rounded-2 border border-stroke-weak bg-background-base text-xs shadow-md"
					onWheel={(e) => {
						e.nativeEvent.stopPropagation();
					}}
				>
					<p className="border-b border-stroke-weak px-3 py-2 font-strong text-text-strong">
						{selectedGraphNode.id}
					</p>
					{selectedGraphNode.relations.length > 0 && (
						<>
							<p className="px-3 pt-2 pb-1 font-strong text-text-weak">{"Related persons"}</p>
							<div className="max-h-56 overflow-y-auto px-3 pb-3">
								<table className="w-full border-collapse">
									<tbody>
										{selectedGraphNode.relations.map((r, i) => {
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
			) : null}
			{selectedEdge ? (
				<div
					className="absolute top-4 right-4 z-50 w-72 rounded-2 border border-stroke-weak bg-background-base text-xs shadow-md"
					onWheel={(e) => {
						e.nativeEvent.stopPropagation();
					}}
				>
					<p className="border-b border-stroke-weak px-3 py-2 font-strong text-text-strong">
						{selectedEdge.source}
						{" ↔ "}
						{selectedEdge.target}
					</p>
					{selectedEdge.data.attestations.length > 1 && (
						<div className="border-b border-stroke-weak px-3 py-2">
							<p className="font-strong text-text-strong">
								{[
									...new Set(
										selectedEdge.data.attestations.map((a) => {
											return a.label;
										}),
									),
								].join(" · ")}
							</p>
							<p className="text-text-weak">
								{"asserted "}
								<span className="tabular-nums">{selectedEdge.data.attestations.length}</span>
								{" times · "}
								<span className="tabular-nums">{selectedEdge.data.totalCount}</span>
								{" total result count"}
							</p>
						</div>
					)}
					<div className="max-h-80 overflow-y-auto p-3">
						{selectedEdge.data.attestations.map((att, i) => {
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
		</div>
	);
}
