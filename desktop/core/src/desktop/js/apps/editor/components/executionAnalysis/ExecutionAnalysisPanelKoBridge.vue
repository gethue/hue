<!--
  Licensed to Cloudera, Inc. under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  Cloudera, Inc. licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->

<template>
  <ExecutionAnalysisPanel :executable="executable" @execution-error="onExecutionError" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';
  import { wrap } from 'vue/webComponentWrapper';

  import ExecutionAnalysisPanel from './ExecutionAnalysisPanel.vue';
  import SqlExecutable from 'apps/editor/execution/sqlExecutable';
  import SubscriptionTracker from 'components/utils/SubscriptionTracker';

  @Component({
    components: { ExecutionAnalysisPanel }
  })
  export default class ExecutionAnalysisPanelKoBridge extends Vue {
    @Prop()
    executableObservable?: KnockoutObservable<SqlExecutable | undefined>;

    initialized = false;
    executable: SqlExecutable | null = null;

    subTracker = new SubscriptionTracker();

    updated(): void {
      if (!this.initialized && this.executableObservable) {
        this.executable = this.executableObservable() || null;
        this.subTracker.subscribe(this.executableObservable, executable => {
          this.executable = executable || null;
        });
        this.initialized = true;
      }
    }

    destroyed(): void {
      this.subTracker.dispose();
    }

    onExecutionError(): void {
      this.$el.dispatchEvent(new CustomEvent('execution-error', { bubbles: true }));
    }
  }

  export const COMPONENT_NAME = 'execution-analysis-panel-ko-bridge';
  wrap(COMPONENT_NAME, ExecutionAnalysisPanelKoBridge);
</script>
