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
import { withTranslation } from 'react-i18next';
import { Divider, TextField } from '@material-ui/core';

const TransformConfiguration = ({ state, ableToEdit, onChange, t }) => (
    <>
        <Divider />
        {state.name && (
            <TextField
                disabled={!ableToEdit}
                label={t('jobDesigner:transformConfiguration.Output')}
                placeholder={t('jobDesigner:transformConfiguration.Placeholder')}
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={16}
                name="statement"
                value={state.statement || ''}
                onChange={event => onChange(event.target.name, event.target.value)}
            />
        )}
    </>
);

TransformConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(TransformConfiguration);
