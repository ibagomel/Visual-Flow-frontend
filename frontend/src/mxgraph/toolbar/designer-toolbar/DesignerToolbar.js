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
                            'mxStyleChange';
                        if (
                            Object.getPrototypeOf(obj).constructor.name ===
                            'mxValueChange'
                        ) {
                            skipEdit =
                                get(obj, 'value.attributes.text.value', '').length >
                                    0 &&
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

    undoManagerUndo() {
        const { setConfigChanged, setDirty, data } = this.props;
        const that = this;
        return function redo() {
            const undoStartIndex = isEmpty(data.definition.graph) ? 0 : 1;
            while (this.indexOfNextAdd > undoStartIndex) {
                this.indexOfNextAdd -= 1;
                const changedStage =
                    this.history[this.indexOfNextAdd].changes.find(
                        obj =>
                            (Object.getPrototypeOf(obj).constructor.name ===
                                'mxGeometryChange' &&
                                obj.previous.width !== obj.geometry.width) ||
                            Object.getPrototypeOf(obj).constructor.name ===
                                'mxValueChange'
                    ) || {};
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
                Object.getPrototypeOf(changedStage).constructor.name ===
                    'mxValueChange' && setConfigChanged(true);
                Object.getPrototypeOf(changedStage).constructor.name ===
                    'mxGeometryChange' && that.state.undoManager.undo();

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
                const resizedNewStage = this.history[
                    this.indexOfNextAdd + 1
                ]?.changes.find(
                    obj =>
                        Object.getPrototypeOf(obj).constructor.name ===
                            'mxGeometryChange' &&
                        obj.previous.width !== obj.geometry.width
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
                resizedNewStage && that.state.undoManager.redo();

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
