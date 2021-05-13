/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
TODO: list of todo items:
1. Structure
    * make separate page for Transformation and place the Graph component into it:
        - page has to content all save-load functionality and pass proper methods into Graph as props
        - page is connected to store, graph is not connected to store
    *
2. Styles
    * use CSS Modules
    * adapt style of nodes to carbon-like
    * adapt style of right-click menu to carbon-like (or remove the menu)
    * replace tooltip with description by corresponding carbon component
    * when user drags new node it has to look like (or close to) the final node
    *
3. Validation
    * curricular graph is not allowed
    * 'input' stages (read data) have to have only output connections
    * 'output' stages (write data) have to have only input connections
    * other stages have to have at least one input connection and at least one output connection
    * display wrong stages in red
    *
4. Functionality
    * add proper stages into the palette
    * add object with stage details into node attributes
    * add editing for every stage type (modal window)
    * do not allow overlay nodes
    * rework toolbar:
        - add/remove some actions
        - maybe better to convert them into icon-buttons
        - maybe move some of their functions on the mouse and/or keyboard
          (f.e. scrolling mouse wheel or pressing +/- on keyboard => zooming)
    * convert to the json that is understandable by Gateway
    * remove XML from component
    * when graph model is changed component has to call a callback to pass new model to parent page
    *
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import mxgraph from 'mxgraph';
import { isEqual, get, has } from 'lodash';
import './common.css';
import { compose } from 'redux';
import { withStyles } from '@material-ui/styles';
import ReactDOMServer from 'react-dom/server';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    setCurrentCell,
    setGraphDirty,
    setLogsModal,
    setSidePanel,
    setSidePanelDirty,
    setZoomValue
} from '../../redux/actions/mxGraphActions';
import styles from './GraphDesigner.Styles';
import DesignerToolbar from './toolbar/DesignerToolbar';
import SidePanel from './side-panel/SidePanel';
import Sidebar from './sidebar/Sidebar';
import renderStage from './stages/renderStage';
import JsonCodec from './sidebar/JsonCodec';
import stageLabels from './stageLabels';

import history from '../../utils/history';
import JobsToolbar from './toolbar/jobs-toolbar';
import RenderJobConfiguration from './side-panel/RenderJobConfiguration';
import PipelinesToolbar from './toolbar/pipelines-toolbar';
import RenderPipelineConfiguration from './side-panel/RenderPipelineConfiguration';
import {
    READ,
    WRITE,
    JOIN,
    CDC,
    EDGE,
    JOB,
    PIPELINE,
    PENDING,
    RUNNING,
    SUCCEEDED,
    FAILED
} from './constants';
import LogsModal from '../../pages/logs/logsModal/LogsModal';

const {
    mxGraph,
    mxConstants,
    mxEdgeStyle,
    mxGraphHandler,
    mxGuide,
    mxEdgeHandler,
    mxRubberband,
    mxClient,
    mxUtils,
    mxEvent,
    mxConstraintHandler,
    mxConnectionConstraint,
    mxCellState,
    mxPoint,
    mxPerimeter,
    mxCompactTreeLayout
} = mxgraph();

class GraphDesigner extends Component {
    constructor(props) {
        super(props);
        this.refGraph = React.createRef();

        this.state = {
            graph: {},
            jobId: ''
        };

        this.createPopupMenu = this.popupMenu.bind(this);
    }

    componentDidMount() {
        const { data } = this.props;
        this.loadGraph(data?.definition);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(prevProps) {
        const { data } = this.props;
        const { graph } = this.state;
        this.changeBorder();
        if (!isEqual(data?.definition, prevProps.data?.definition)) {
            this.loadContent(data?.definition, graph);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    popupMenu = (graph, menu, cell, event) => {
        const { data, sidePanelIsOpen, setDirtyGraph, setPanel } = this.props;
        if (
            (cell && !has(data, 'editable')) ||
            this.graphIsDisabled(data.editable)
        ) {
            if (cell.edge) {
                menu.addItem('Delete connection', null, () => {
                    graph.removeCells([cell]);
                    mxEvent.consume(event);
                });
            } else {
                menu.addItem('Edit child node', null, () => {
                    // mxUtils.alert('Edit child node: ');
                    // selectionChanged(graph)
                });
                menu.addItem('Delete child node', null, () => {
                    sidePanelIsOpen && setPanel(false);
                    graph.removeCells([cell]);
                    mxEvent.consume(event);
                    setDirtyGraph(true);
                });
            }
        }
    };

    handleKeyDown = event => {
        const { data, sidePanelIsOpen, setDirtyGraph } = this.props;
        const { graph } = this.state;
        if (event.keyCode === 46 && !sidePanelIsOpen) {
            if (!has(data, 'editable') || this.graphIsDisabled(data.editable)) {
                setDirtyGraph(true);
                const currentNodes = graph.getSelectionCells();
                graph.removeCells(currentNodes);
            }
        }
    };

    loadGlobalSetting = () => {
        // Enable alignment lines to help locate
        mxGraphHandler.prototype.guidesEnabled = true;
        // Alt disables guides
        mxGuide.prototype.isEnabledForEvent = event => !mxEvent.isAltDown(event);
        // Specifies if waypoints should snap to the routing centers of terminals
        mxEdgeHandler.prototype.snapToTerminals = true;
    };

    // main setting
    setGraphSetting = () => {
        const { jobs, type, setPanel } = this.props;
        const { graph } = this.state;
        const that = this;
        graph.gridSize = 10;
        graph.setPanning(true);
        graph.setTooltips(true);
        graph.setConnectable(true);
        graph.setCellsEditable(true);
        graph.setEnabled(true);

        graph.setCellsResizable(false);

        // Enables HTML labels
        graph.setHtmlLabels(true);
        graph.centerZoom = true;
        // Autosize labels on insert where autosize=1
        graph.autoSizeCellsOnAdd = true;

        // Disable unconnected edges
        graph.setAllowDanglingEdges(false);
        graph.setDisconnectOnMove(false);

        // eslint-disable-next-line no-new
        new mxRubberband(graph);
        graph.getTooltipForCell = cell => cell.getAttribute('desc');

        const vertexStyle = [];
        vertexStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        vertexStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        vertexStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        vertexStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        vertexStyle[mxConstants.STYLE_FILLCOLOR] = '#C3D9FF';
        vertexStyle[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
        vertexStyle[mxConstants.STYLE_FONTCOLOR] = '#000000';
        vertexStyle[mxConstants.HANDLE_FILLCOLOR] = '#80c6ee';
        if (type === PIPELINE) {
            vertexStyle[mxConstants.STYLE_STROKEWIDTH] = 4;
        }
        graph.getStylesheet().putDefaultVertexStyle(vertexStyle);

        const edgeStyle = [];
        edgeStyle[mxConstants.STYLE_STROKECOLOR] = '#4CAF50';
        edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
        edgeStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        edgeStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        edgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        edgeStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
        edgeStyle[mxConstants.STYLE_FONTSIZE] = '10';

        graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

        graph.popupMenuHandler.factoryMethod = (menu, cell, event) =>
            that.createPopupMenu(graph, menu, cell, event);
        graph.convertValueToString = cell => {
            if (
                mxUtils.isNode(cell.value) &&
                cell.value.nodeName.toLowerCase() === 'taskobject'
            ) {
                const results = {};
                Object.keys(cell.value.attributes).forEach(attrKey => {
                    const attribute = cell.value.attributes[attrKey];
                    results[attribute.nodeName] = attribute.nodeValue;
                });
                if (cell.getAttribute('operation') === JOB) {
                    const job = jobs.find(
                        item => item.id === cell.getAttribute('jobId')
                    );
                    if (job) {
                        results.status = job?.status;
                    }
                }
                // Returns a DOM for the label
                return ReactDOMServer.renderToString(
                    renderStage(results, this.props.t)
                );
            }

            return null;
        };

        graph.addListener(mxEvent.EDITING_STARTED, (sender, event) => {
            const cell = event.getProperty('cell');
            if (cell?.vertex) {
                this.props.setCurrentCell(graph.getSelectionCell().id);
                setPanel(true);
                this.props.setSidePanelDirty(false);
            }
            graph.cellEditor.stopEditing(true);
        });

        graph.addListener(mxEvent.CLICK, (sender, event) => {
            const cell = event.getProperty('cell');
            if (cell != null) {
                const mouseEvent = event.getProperty('event');
                const nodeName = get(mouseEvent, 'target.nodeName', '');
                const nodeId =
                    nodeName === 'svg'
                        ? get(mouseEvent, 'target.id', '')
                        : get(mouseEvent, 'target.parentElement.id', '');
                if (
                    cell.getAttribute('operation') === JOB &&
                    cell.getAttribute('jobId') === nodeId
                ) {
                    this.setState({ jobId: nodeId });
                    this.props.setLogs(true);
                }
            }
        });
    };

    // settings for "Automatic layout" toolbar
    setLayoutSetting = () => {
        const { graph } = this.state;
        const layout = new mxCompactTreeLayout(graph, false);
        layout.parallelEdgeSpacing = 10;
        layout.useBoundingBox = false;
        layout.edgeRouting = false;
        layout.levelDistance = 60;
        layout.nodeDistance = 16;
        layout.parallelEdgeSpacing = 10;
        layout.isVertexMovable = () => true;
        // layout.localEdgeProcessing = node => console.log(node);
    };

    setLabel = (targetNodeType, labelCDC, labelJOIN) =>
        targetNodeType === CDC ? labelCDC : labelJOIN;

    selectionChange = () => {
        const { graph } = this.state;
        const { t } = this.props;
        const current = graph.getSelectionCell();

        if (get(current, 'edge', false)) {
            const targetId = current.target.id;
            const targetNode = graph.model.cells[targetId];
            const targetNodeType = get(
                targetNode,
                'value.attributes.operation.value',
                ''
            );
            const inputEdges = targetNode?.edges?.filter(
                edge => edge.target.id === targetId
            );
            // NEED REFACTOR
            if (targetNodeType === CDC || targetNodeType === JOIN) {
                graph.model.setValue(
                    inputEdges[0],
                    stageLabels({
                        operation: EDGE,
                        text: this.setLabel(
                            targetNodeType,
                            t('jobDesigner:CDCConfiguration.After'),
                            t('jobDesigner:joinConfiguration.Left')
                        )
                    })
                );

                graph.model.setValue(
                    inputEdges[1],
                    stageLabels({
                        operation: EDGE,
                        text: this.setLabel(
                            targetNodeType,
                            t('jobDesigner:CDCConfiguration.Before'),
                            t('jobDesigner:joinConfiguration.Right')
                        )
                    })
                );
            }
        }
    };

    // connecting between vertices
    settingConnection = () => {
        const { graph } = this.state;
        mxConstraintHandler.prototype.intersects = (
            icon,
            point,
            source,
            existingEdge
        ) => !source || existingEdge || mxUtils.intersects(icon.bounds, point);

        if (graph.connectionHandler.connectImage === null) {
            graph.connectionHandler.isConnectableCell = () => false;
            mxEdgeHandler.prototype.isConnectableCell = cell =>
                graph.connectionHandler.isConnectableCell(cell);
        }

        graph.getAllConnectionConstraints = function getConnections(
            terminal,
            source
        ) {
            const targetNodeType = get(
                terminal,
                'cell.value.attributes.operation.value',
                ''
            );

            if (
                (targetNodeType === WRITE && source) ||
                (targetNodeType === READ && !source)
            ) {
                return null;
            }

            if (terminal !== null && this.model.isVertex(terminal.cell)) {
                return [
                    new mxConnectionConstraint(new mxPoint(0.25, 0), true),
                    new mxConnectionConstraint(new mxPoint(0.5, 0), true),
                    new mxConnectionConstraint(new mxPoint(0.75, 0), true),

                    new mxConnectionConstraint(new mxPoint(0, 0.25), true),
                    new mxConnectionConstraint(new mxPoint(0, 0.5), true),
                    new mxConnectionConstraint(new mxPoint(0, 0.75), true),

                    new mxConnectionConstraint(new mxPoint(1, 0.25), true),
                    new mxConnectionConstraint(new mxPoint(1, 0.5), true),
                    new mxConnectionConstraint(new mxPoint(1, 0.75), true),

                    new mxConnectionConstraint(new mxPoint(0.25, 1), true),
                    new mxConnectionConstraint(new mxPoint(0.5, 1), true),
                    new mxConnectionConstraint(new mxPoint(0.75, 1), true)
                ];
            }
            return null;
        };

        const obj = stageLabels({
            operation: EDGE,
            successPath: 'true',
            text: ''
        });
        // Connect preview
        graph.connectionHandler.createEdgeState = function createEdge() {
            const edge = graph.createEdge(
                null,
                null,
                obj,
                null,
                null,
                'edgeStyle=orthogonalEdgeStyle'
            );
            return new mxCellState(
                this.graph.view,
                edge,
                this.graph.getCellStyle(edge)
            );
        };
    };

    loadGraph = content => {
        // eslint-disable-next-line react/no-find-dom-node
        const container = ReactDOM.findDOMNode(this.refGraph.current);
        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        } else {
            const graph = new mxGraph(container);
            this.setState({ graph }, () => {
                // layout
                const layout = new mxCompactTreeLayout(graph, false);
                this.setLayoutSetting(layout);
                this.loadGlobalSetting();
                this.setGraphSetting();
                this.settingConnection();
                content && this.loadContent(content, graph);
            });
            // Disables the built-in context menu
            mxEvent.disableContextMenu(container);
            // Trigger event after selection
            graph
                .getSelectionModel()
                .addListener(mxEvent.CHANGE, this.selectionChange);
        }
    };

    loadContent = (content, graph) => {
        const jsonEncoder = new JsonCodec();
        const vertices = {};
        const parent = graph.getDefaultParent();
        graph.getModel().beginUpdate(); // Adds cells to the model in a single step
        try {
            // clear graph before render saved content
            graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));

            content?.graph?.forEach(node => {
                if (node.value) {
                    const xmlNode = jsonEncoder.encode(node.value);
                    if (xmlNode.getAttribute('operation') === EDGE) {
                        graph.insertEdge(
                            parent,
                            null,
                            xmlNode,
                            vertices[node.source],
                            vertices[node.target],
                            node.style
                        );
                    } else {
                        vertices[node.id] = graph.insertVertex(
                            parent,
                            null,
                            xmlNode,
                            node.geometry.x,
                            node.geometry.y,
                            node.geometry.width,
                            node.geometry.height,
                            node.style
                        );
                    }
                }
            });
        } finally {
            graph.getModel().endUpdate(); // Updates the display
        }
    };

    swapEdges = () => {
        const { graph } = this.state;
        const currentCell = graph.getSelectionCell();

        const inputEdges = currentCell?.edges?.filter(
            edge => edge.source.id !== currentCell.id
        );
        if (inputEdges && inputEdges.length === 2) {
            const first = inputEdges[0];
            const second = inputEdges[1];

            graph.removeCells([first]);
            graph.removeCells([second]);

            graph.insertEdge(
                second.parent,
                null,
                first.value,
                second.source,
                second.target,
                second.style
            );
            graph.insertEdge(
                first.parent,
                null,
                second.value,
                first.source,
                first.target,
                first.style
            );
        }
    };

    zoom = val => {
        const { graph } = this.state;

        const roundedValue = +val.toFixed(1);
        if (roundedValue > 1.5 || roundedValue < 0.5) {
            return;
        }
        graph.zoomTo(roundedValue);
        this.props.setZoomValue(roundedValue);
    };

    changeColor = val => {
        let color;
        if (val === SUCCEEDED) {
            color = '#81c784';
        } else if (val === FAILED) {
            color = '#E57373';
        } else if (val === RUNNING || val === PENDING) {
            color = '#64b5f6';
        }
        return color;
    };

    changeBorder = () => {
        const { data, type } = this.props;
        let newStyle;
        if (type === PIPELINE) {
            if (data?.definition?.graph) {
                data.definition.graph.forEach(stage => {
                    if (!stage.edge) {
                        newStyle = stage.style.replace(
                            /strokeColor=#[0-9a-fA-F]{6};/,
                            'strokeColor=#bdbdbd;'
                        );
                        // eslint-disable-next-line no-param-reassign
                        stage.style = newStyle;
                    }
                });
                if (data?.jobsStatuses) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const [key, val] of Object.entries(data?.jobsStatuses)) {
                        const currentStage = data?.definition.graph.find(
                            item => item.id === key
                        );
                        newStyle = currentStage.style.replace(
                            '#bdbdbd',
                            this.changeColor(val)
                        );
                        currentStage.style = newStyle;
                    }
                }
            }
        }
    };

    graphIsDisabled = value => {
        const { data } = this.props;
        return data.status === PENDING || data.status === RUNNING ? false : value;
    };

    render() {
        const {
            classes,
            data,
            param,
            type,
            zoomVal,
            panning,
            showLogsModal,
            sidePanelIsOpen,
            setPanel,
            setDirtyGraph,
            setLogs
        } = this.props;
        const { graph, jobId } = this.state;
        const currentPath = history.location.pathname.split('/');
        const currentProject = currentPath.slice(-2, -1)[0];
        const currentJob = type === PIPELINE ? jobId : currentPath.slice(-1)[0];

        return (
            <div className={classes.root}>
                <LogsModal
                    display={showLogsModal}
                    projectId={currentProject}
                    jobId={currentJob}
                    onClose={() => setLogs(false)}
                />
                <Sidebar
                    graph={graph}
                    name={data?.name}
                    ableToEdit={this.graphIsDisabled(param)}
                />
                <div className={classes.content}>
                    <DesignerToolbar zoom={this.zoom} graph={graph}>
                        {type === JOB && (
                            <JobsToolbar
                                setShowModal={setLogs}
                                data={data}
                                setSidePanel={setPanel}
                                sidePanelIsOpen={sidePanelIsOpen}
                                setDirty={setDirtyGraph}
                            />
                        )}
                        {type === PIPELINE && (
                            <PipelinesToolbar
                                data={data}
                                setSidePanel={setPanel}
                                sidePanelIsOpen={sidePanelIsOpen}
                                setDirty={setDirtyGraph}
                            />
                        )}
                    </DesignerToolbar>
                    <div
                        onWheel={e => {
                            if (e.deltaY < 0) {
                                this.zoom(zoomVal + 0.1);
                            } else {
                                this.zoom(zoomVal - 0.1);
                            }
                        }}
                        id="refGraph"
                        className={classNames(
                            classes.container,
                            panning && classes.panTool
                        )}
                        ref={this.refGraph}
                    />
                </div>
                <SidePanel graph={graph} type={type}>
                    {type === JOB && (
                        <RenderJobConfiguration
                            ableToEdit={
                                !has(data, 'editable') ||
                                this.graphIsDisabled(data.editable)
                            }
                            swapEdges={this.swapEdges}
                        />
                    )}
                    {type === PIPELINE && (
                        <RenderPipelineConfiguration
                            ableToEdit={
                                !has(data, 'editable') ||
                                this.graphIsDisabled(data.editable)
                            }
                            swapEdges={this.swapEdges}
                        />
                    )}
                </SidePanel>
            </div>
        );
    }
}

GraphDesigner.propTypes = {
    setLogs: PropTypes.func,
    setDirtyGraph: PropTypes.func,
    setPanel: PropTypes.func,
    setCurrentCell: PropTypes.func,
    setSidePanelDirty: PropTypes.func,
    setZoomValue: PropTypes.func,
    classes: PropTypes.object,
    data: PropTypes.object,
    t: PropTypes.func,
    param: PropTypes.bool,
    sidePanelIsOpen: PropTypes.bool,
    type: PropTypes.string,
    zoomVal: PropTypes.number,
    panning: PropTypes.bool,
    showLogsModal: PropTypes.bool,
    jobs: PropTypes.array
};

const mapStateToProps = state => ({
    sidePanelIsOpen: state.mxGraph.sidePanelIsOpen,
    data: state.mxGraph.data,
    param: state.pages.settingsParameters.data?.editable,
    zoomVal: state.mxGraph.zoomValue,
    jobs: state.pages.jobs.data.jobs,
    panning: state.mxGraph.panning,
    showLogsModal: state.mxGraph.showLogsModal
});

const mapDispatchToProps = {
    setLogs: setLogsModal,
    setDirtyGraph: setGraphDirty,
    setSidePanelDirty,
    setPanel: setSidePanel,
    setCurrentCell,
    setZoomValue
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(GraphDesigner);
