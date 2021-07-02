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

import {
    Home,
    ImportExport,
    Settings,
    Timeline,
    TransformSharp,
    ExitToAppSharp
} from '@material-ui/icons';

const menu = id =>
    id && [
        {
            name: 'Overview',
            link: `/${id}/overview`,
            Icon: Home
        },
        {
            name: 'Jobs',
            link: `/${id}/jobs`,
            Icon: TransformSharp
        },
        {
            name: 'Pipelines',
            link: `/${id}/pipelines`,
            Icon: Timeline
        },
        {
            name: 'Import',
            link: `/${id}/import`,
            Icon: ImportExport
        },
        {
            name: 'Settings',
            items: [
                {
                    name: 'Basic',
                    link: `/${id}/settings/basic`
                },
                {
                    name: 'Parameters',
                    link: `/${id}/settings/parameters`
                },
                {
                    name: 'Users/Roles',
                    link: `/${id}/settings/users`
                }
            ],
            Icon: Settings
        },
        {
            name: 'Exit',
            link: '/',
            Icon: ExitToAppSharp
        }
    ];
export default menu;
