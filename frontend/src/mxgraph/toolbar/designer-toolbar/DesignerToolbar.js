/*
 * Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
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

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Toolbar, Divider } from '@material-ui/core';
import mxgraph from 'mxgraph';
import { withStyles } from '@material-ui/styles';

import { get, isEmpty } from 'lodash';
import styles from './DesignerToolbar.Styles';
import Zoom from '../zoom';
import addPropsToChildren from '../../../utils/addPropsToChildren';
import { JOIN, CDC } from '../../constants';

const { mxEvent, mxUndoManager, mxEventObject } = mxgraph();

class DesignerToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            undoManager: {},
            undoButtonsDisabling: { undo: true, redo: true }
        };
    }

    componentDidUpdate(prevProps) {
        const { graph, data } = this.props;
        if (prevProps.graph !== graph) {
            const undoManagerStartIndex = isEmpty(data.definition.graph) ? 0 : 1;
            const undoManager = new mxUndoManager(25);
            undoManager.undo = this.undoManagerUndo();
            undoManager.redo = this.undoManagerRedo();
            const listener = (sender, event) => {
                const unnecessaryEdit =
                    event.getProperty('edit').changes.find(obj => {
                        let skipEdit = false;
                        skipEdit =
                            Object.getPrototypeOf(obj).constructor.name ===
                                'mxStyleChange' && !obj.cell.edge;
                        if (
                            Object.getPrototypeOf(obj).constructor.name ===
                            'mxValueChange'
                        ) {
                            skipEdit =
                                get(
                                    obj,
                                    'value.attributes.successPath.value',
                                    ''
                                ) ===
                                    get(
                                        obj,
                                        'previous.attributes.successPath.value',
                                        ''
                                    ) &&
                                get(
                                    obj,
                                    'value.attributes.operation.value',
                                    false
                                ) === 'EDGE';
                        }
                        return skipEdit;
                    }) || false;
                if (
                    !(
                        unnecessaryEdit &&
                        event.getProperty('edit').changes.length === 1
                    )
                ) {
                    undoManager.undoableEditHappened(event.getProperty('edit'));
                    undoManagerStartIndex !== undoManager.indexOfNextAdd &&
                        this.setState({
                            undoButtonsDisabling: {
                                undo: false,
                                redo: true
                            }
                        });
                }
            };
            graph.getModel().addListener(mxEvent.UNDO, listener);
            graph.getView().addListener(mxEvent.UNDO, listener);
            this.setState({ undoManager });
        }
    }

    undoManagerChangedStage = history => {
        if (history) {
            return history.changes.find(obj => {
                if (
                    Object.getPrototypeOf(obj).constructor.name ===
                        'mxGeometryChange' &&
                    obj.previous.width !== obj.geometry.width
                ) {
                    return true;
                }
                if (
                    Object.getPrototypeOf(obj).constructor.name ===
                        'mxStyleChange' &&
                    obj.cell.edge &&
                    history.changes.length <= 1
                ) {
                    return true;
                }
                return false;
            });
        }
        return false;
    };

    lengthCheck = (obj, first, second) => {
        return obj.length === first || obj.length === second;
    };

    joinCDCChange = (history, operationValue) =>
        history?.changes.find(
            obj =>
                Object.getPrototypeOf(obj).constructor.name === 'mxValueChange' &&
                (get(obj, operationValue, '') === JOIN ||
                    get(obj, operationValue, '') === CDC) &&
                this.lengthCheck(history.changes, 1, 6)
        );

    joinCDCAddedEdge = (history, index, joinCDCChange) =>
        history[index - 1].changes.find(
            obj =>
                obj.cell?.edge &&
                joinCDCChange &&
                history[index].changes.length === 1 &&
                this.lengthCheck(history[index - 1].changes, 12, 18)
        );

    arrowChange = (history, index, prevIndex, joinCDCChange) =>
        history[index]?.changes.find(
            obj =>
                joinCDCChange &&
                obj.model.currentEdit.changes.length === 0 &&
                history[prevIndex]?.changes.length === 1 &&
                history[index].changes.length === 1
        );

    edgeReassign = (history, index, prevIndex, nextIndex) =>
        history[index]?.changes.find(
            obj =>
                Object.getPrototypeOf(obj).constructor.name === 'mxValueChange' &&
                history[prevIndex]?.changes.length === 1 &&
                history[nextIndex]?.changes.length === 6
        );

    undoManagerUndo() {
        const { setConfigChanged, setDirty, data } = this.props;
        const that = this;
        const operationValue = 'cell.value.attributes.operation.value';
        return function redo() {
            const undoStartIndex = isEmpty(data.definition.graph) ? 0 : 1;
            while (this.indexOfNextAdd > undoStartIndex) {
                this.indexOfNextAdd -= 1;
                const changedConfiguration = this.history[
                    this.indexOfNextAdd
                ].changes.find(
                    obj =>
                        Object.getPrototypeOf(obj).constructor.name ===
                        'mxValueChange'
                );
                const joinCDCAddedEdge = that.joinCDCAddedEdge(
                    this.history,
                    this.indexOfNextAdd,
                    that.joinCDCChange(
                        this.history[this.indexOfNextAdd],
                        operationValue
                    )
                );
                const arrowChange = that.arrowChange(
                    this.history,
                    this.indexOfNextAdd,
                    this.indexOfNextAdd - 1,
                    that.joinCDCChange(
                        this.history[this.indexOfNextAdd],
                        operationValue
                    )
                );
                const edgeReassign = that.edgeReassign(
                    this.history,
                    this.indexOfNextAdd,
                    this.indexOfNextAdd,
                    this.indexOfNextAdd - 1
                );
                const changedStage = that.undoManagerChangedStage(
                    this.history[this.indexOfNextAdd]
                );
                const edit = this.history[this.indexOfNextAdd];
                edit.undo();

                if (this.indexOfNextAdd === undoStartIndex) {
                    setDirty(false);
                    that.setState({
                        undoButtonsDisabling: { redo: false, undo: true }
                    });
                } else {
                    setDirty(true);
                    that.setState({
                        undoButtonsDisabling: { undo: false, redo: false }
                    });
                }
                changedConfiguration && setConfigChanged(true);
                changedStage && that.state.undoManager.undo();
                joinCDCAddedEdge && that.state.undoManager.undo();
                arrowChange && that.state.undoManager.undo();
                edgeReassign && that.state.undoManager.undo();
                if (edit.isSignificant()) {
                    this.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
                    break;
                }
            }
        };
    }

    undoManagerRedo() {
        const { setConfigChanged, setDirty, data } = this.props;
        const that = this;
        const operationValue = 'cell.value.attributes.operation.value';
        // eslint-disable-next-line complexity
        return function redo() {
            const redoStartIndex = isEmpty(data.definition.graph) ? 0 : 1;
            while (this.indexOfNextAdd < this.history.length) {
                const changedConfiguration = this.history[
                    this.indexOfNextAdd
                ].changes.find(
                    obj =>
                        Object.getPrototypeOf(obj).constructor.name ===
                        'mxValueChange'
                );
                const changedStage = that.undoManagerChangedStage(
                    this.history[this.indexOfNextAdd + 1]
                );
                const joinCDCAddedEdge = that.joinCDCAddedEdge(
                    this.history,
                    this.indexOfNextAdd + 1,
                    that.joinCDCChange(
                        this.history[this.indexOfNextAdd + 1],
                        operationValue
                    )
                );
                const arrowChange = that.arrowChange(
                    this.history,
                    this.indexOfNextAdd,
                    this.indexOfNextAdd + 1,
                    that.joinCDCChange(
                        this.history[this.indexOfNextAdd + 1],
                        operationValue
                    )
                );
                const edgeReassign = that.edgeReassign(
                    this.history,
                    this.indexOfNextAdd,
                    this.indexOfNextAdd + 1,
                    this.indexOfNextAdd
                );
                const edit = this.history[this.indexOfNextAdd];
                this.indexOfNextAdd += 1;
                edit.redo();

                if (redoStartIndex !== this.indexOfNextAdd) {
                    setDirty(true);
                    that.setState({
                        undoButtonsDisabling: {
                            undo: false,
                            redo: false
                        }
                    });
                }
                this.indexOfNextAdd === this.history.length &&
                    that.setState({
                        undoButtonsDisabling: {
                            undo: false,
                            redo: true
                        }
                    });
                changedConfiguration && setConfigChanged(true);
                changedStage && that.state.undoManager.redo();
                joinCDCAddedEdge && that.state.undoManager.redo();
                arrowChange && that.state.undoManager.redo();
                edgeReassign && that.state.undoManager.redo();
                if (edit.isSignificant()) {
                    this.fireEvent(new mxEventObject(mxEvent.REDO, 'edit', edit));
                    break;
                }
            }
        };
    }

    renderChildren = () => {
        const { graph, children, data, setDirty } = this.props;
        const { undoManager: reversible, undoButtonsDisabling } = this.state;

        return addPropsToChildren(children, {
            graph,
            reversible,
            data,
            setDirty,
            undoButtonsDisabling
        });
    };

    render() {
        const { graph, classes, zoom } = this.props;

        return (
            <Toolbar disableGutters className={classes.toolbar}>
                <Zoom zoom={zoom} graph={graph} />
                <Divider orientation="vertical" flexItem />
                {this.renderChildren()}
            </Toolbar>
        );
    }
}

DesignerToolbar.propTypes = {
    graph: PropTypes.object,
    classes: PropTypes.object,
    children: PropTypes.array,
    zoom: PropTypes.func,
    setConfigChanged: PropTypes.func,
    setDirty: PropTypes.func,
    data: PropTypes.object
};

export default compose(withStyles(styles))(DesignerToolbar);
