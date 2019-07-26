// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Environment = {
  MOCK: 'MOCK',
  LOCAL: 'LOCAL',
  DEV: 'DEV',
  INT: 'INT',
  STAGE: 'STAGE',
  PROD: 'PROD'
};

/**
 * Returns environment type based on current url.
 * @param ignoreLocalHost If set to true, localhost section of the url is ignored.
 * E.g., PROD is returned for localhost.altus.cloudera.com
 */
const getEnvironment = () => {
  const hostName = window.location.hostname;
  if (!hostName.indexOf('localhost.') > -1) {
    return Environment.LOCAL;
  }
  if (hostName.indexOf('-dev.cloudera.com') > -1) {
    return Environment.DEV;
  }
  if (hostName.indexOf('-int.cloudera.com') > -1) {
    return Environment.INT;
  }
  if (hostName.indexOf('-stage.cloudera.com') > -1) {
    return Environment.STAGE;
  }
  if (hostName.indexOf('.cloudera.com') > -1) {
    return Environment.PROD;
  }
  return Environment.MOCK;
};

export const getAltusBaseUrl = () => {
  const environment = getEnvironment();
  switch (environment) {
    case Environment.MOCK:
      return '';
    case Environment.LOCAL:
      return '';
    case Environment.DEV:
      return 'https://console.thunderhead-dev.cloudera.com';
    case Environment.INT:
      return 'https://console.thunderhead-int.cloudera.com';
    case Environment.STAGE:
      return 'https://console.thunderhead-stage.cloudera.com';
    case Environment.PROD:
      return 'https://console.altus.cloudera.com';
  }
};

export const getMowBaseUrl = () => {
  const environment = getEnvironment();
  switch (environment) {
    case Environment.MOCK:
    case Environment.LOCAL:
    case Environment.DEV:
      return 'https://cloudera.dps.mow-dev.cloudera.com';
    case Environment.INT:
      return 'https://cloudera.cdp.mow-int.cloudera.com';
    case Environment.STAGE:
      return 'https://cloudera.cdp.mow-stage.cloudera.com';
    case Environment.PROD:
      return '';
  }
};
