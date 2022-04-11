[`RetryPolicy`](https://typescript.temporal.io/api/classes/proto.coresdk.common.retrypolicy/) instances in Temporal allow you to define how Temporal retries Activities.
You can specify options like the number of times to retry before failing and how long to wait between retries.
Below are the supported options:

- `backoffCoefficient`: Temporal will multiply how long it waits between retries by this number after every failure
- `initialInterval`: The amount of time Temporal should wait to retry after the first failure
- `maximumAttempts`: The maximum number of times Temporal should retry before erroring out
- `maximumInterval`: The maximum amount of time Temporal will wait between retries
- `nonRetryableErrorTypes`: Array of strings containing the errors to skip retrying

Below is a tool that calculates whether an activity succeeds or fails for a given retry policy.

<script src="../../codemirror-5.62.2/lib/codemirror.js"></script>
<link rel="stylesheet" href="../../codemirror-5.62.2/lib/codemirror.css">
<script src="../../codemirror-5.62.2/mode/javascript/javascript.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js"></script>
<style>
  table {
    border: 0;
    width: 100%;
  }
  .retry-container {
    vertical-align: top;
    width: 50%;
  }
  .add-button {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .retry-policy-container {
    vertical-align: top;
    width: 50%;
  }
  .label-container label {
    float: left;
    max-width: 49%;
  }
  .label-container input {
    float: right;
    max-width: 49%;
  }
  .retry, .parameter {
    padding: 10px;
    padding-top: 15px;
    border: 1px solid #ddd;
    margin-bottom: 15px;
  }
  .retry {
    margin-right: 15px;
  }
  .label-container::after {
    content: "";
    clear: both;
    display: table;
  }
  .slider {
    -webkit-appearance: none;  /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 10px; /* Specified height */
    background: #d3d3d3; /* Grey background */
    outline: none; /* Remove outline */
    opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: .2s; /* 0.2 seconds transition on hover */
    transition: opacity .2s;
    border-radius: 5px;
  }
  .slider::-webkit-slider-thumb {
    height: 25px;
    width: 25px;
  }
  .slider::-moz-range-thumb {
    height: 25px;
    width: 25px;
  }
  .result {
    padding: 5px;
    text-align:center;
    border-radius: 4px;
    margin-top: 25px;
  }
  .success {
    background-color: #D4EDDC;
  }
  .fail {
    background-color: #f8d7da;
  }
  .spacing {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .scenarios {
    font-size: 1.1em;
    padding: 0.25em;
    margin-bottom: 0.5em;
  }
  .output-wrapper {
    border: 1px solid #ddd;
    height: 130px;
  }
  .output-wrapper .CodeMirror {
    height: 130px;
  }
  .result-row {
    display: flex;
    flex-direction: row;
  }
  .result, .retry-chart {
    position: relative;
    width: 100%;
  }
  .result {
    margin-right: 15px;
  }
</style>
<table>
  <tr>
    <td class="retry-container">
      <div class="retries">
        <h1>Retries</h1>
        <select class="scenarios" class="spacing">
          <option value="">Scenarios</option>
          <option value='{"requestRuntimeMS": 10, "successRate": 0.9}'>
            Fast request (10ms), 90% success rate
          </option>
          <option value='{"requestRuntimeMS": 10, "successRate": 0.5}'>
            Fast request (10ms), 50% success rate
          </option>
          <option value='{"requestRuntimeMS": 100, "successRate": 0.9}'>
            Slow request (100ms), 90% success rate
          </option>
          <option value='{"requestRuntimeMS": 100, "successRate": 0.5}'>
            Slow request (100ms), 50% success rate
          </option>
        </select>
      </div>
      <div class="retries-list"></div>
      <button class="add-button" onclick="addRetry(true, 1)">+ Add</button>
    </td>
    <td class="retry-policy-container">
      <h1>Retry Policy (in ms)</h1>
      <div class="parameter">
        <div class="label-container">
          <label>StartToCloseTimeout</label>
          <input class="label-container-item" id="startToCloseTimeout-input" type="number">
        </div>
        <input
          type="range"
          class="slider"
          id="startToCloseTimeout-slider"
          min="0"
          max="100000"
          step="100">
      </div>
      <div class="parameter">
        <div class="label-container">
          <label>backoffCoefficient</label>
          <input class="label-container-item" id="backoffCoefficient-input" type="number">
        </div>
        <input
          type="range"
          class="slider"
          id="backoffCoefficient-slider"
          min="1"
          max="10">
      </div>
      <div class="parameter">
        <div class="label-container">
          <label>initialInterval</label>
          <input class="label-container-item" id="initialInterval-input" type="number">
        </div>
        <input
          type="range"
          class="slider"
          id="initialInterval-slider"
          min="0"
          max="10000"
          step="50">
      </div>
      <div class="parameter">
        <div class="label-container">
          <label>maximumAttempts</label>
          <input class="label-container-item" id="maximumAttempts-input" type="number">
        </div>
        <input
          type="range"
          class="slider"
          id="maximumAttempts-slider"
          min="1"
          max="100">
      </div>
      <div class="parameter">
        <div class="label-container">
          <label>maximumInterval</label>
          <input class="label-container-item" id="maximumInterval-input" type="number">
        </div>
        <input
          type="range"
          class="slider"
          id="maximumInterval-slider"
          min="0" max="100000"
          step="100">
      </div>
      <div class="output-wrapper">
      </div>
    </td>
  </tr>
  <tr>
    <td style="margin-right: 15px; vertical-align: top">
      <div class="result"></div>
    </td>
    <td>
      <div class="retry-chart"><canvas></canvas></div>
    </div>
  </tr>
</table>
<div class="retry" style="display: none">
  <select value="succeeds">
    <option value="fails">Fails after</option>
    <option value="succeeds">Succeeds after</option>
  </select>
  <input type="number" value="1" />
  ms
  <button class="remove">&times;</button>
  <input type="range" class="slider runtime-slider" min="0" max="1000" step="5" />
</div>
<script>
  const retryTemplate = document.querySelector('.retry');
  const resultContainerElement = document.querySelector('.result');
  const retriesListElement = document.querySelector('.retries-list');
  const ctx = document.querySelector('.retry-chart canvas').getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',
    // Configuration options go here
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  const sliderProps = [
    'startToCloseTimeout',
    'backoffCoefficient',
    'initialInterval',
    'maximumAttempts',
    'maximumInterval'
  ];
  const state = {
    retries: [],
    startToCloseTimeout: 10000,
    backoffCoefficient: 2,
    initialInterval: 100,
    maximumAttempts: 5,
    maximumInterval: 100000
  };
  const codemirror = CodeMirror(document.querySelector('.output-wrapper'), {
    mode: 'javascript',
    lineNumbers: true,
    value: JSON.stringify(omit(state, ['retries']), null, '  '),
    tabSize: 2,
    readOnly: true
  });
  codemirror.on('focus', () => codemirror.execCommand('selectAll'));
  let numRetries = 0;
  function omit(obj, props) {
    obj = { ...obj };
    props.forEach(p => { delete obj[p]; });
    return obj;
  }
  updateChart();
  function addRetry(success, runtimeMS) {
    const el = retryTemplate.cloneNode(true);
    if (state.retries.length > 0) {
      state.retries[state.retries.length - 1].success = false;
      state.retries[state.retries.length - 1].select.disabled = true;
      state.retries[state.retries.length - 1].select.value = 'fails';
    }
    const retry = { success, runtimeMS, el };
    state.retries.push(retry);
    const select = el.querySelector('select');
    retry.select = select;
    select.value = success ? 'succeeds' : 'fails';
    const input = el.querySelector('input[type="number"]');
    const slider = el.querySelector('input[type="range"]');
    el.querySelector('.remove').addEventListener('click', () => removeRetry());
    input.value = runtimeMS;
    slider.value = input.value;
    input.addEventListener('change', function() {
      const val = input.value;
      if (!isNaN(val)) {
        slider.value = +val;
        retry.runtimeMS = +val;
        rerenderResult();
      }
    });
    select.addEventListener('change', function() {
      retry.success = select.value === 'succeeds';
      rerenderResult();
    });
    slider.addEventListener('change', function() {
      const val = slider.value;
      input.value = +val;
      retry.runtimeMS = +val;
      rerenderResult();
    });
    retriesListElement.appendChild(el);
    el.style.display = 'block';
    rerenderResult();
  }
  function removeRetry() {
    if (state.retries.length > 0) {
      const lastRetry = state.retries[state.retries.length - 1];
      retriesListElement.removeChild(lastRetry.el);
      state.retries.pop();
      state.retries[state.retries.length - 1].select.disabled = false;
      rerenderResult();
    }
  }
  const scenarios = document.querySelector('.scenarios');
  scenarios.addEventListener('change', function() {
    if (!scenarios.value) {
      return;
    }
    const values = JSON.parse(scenarios.value);
    const requestRuntimeMS = values.requestRuntimeMS;
    const successRate = values.successRate;
    const retries = [];
    const maxRetries = 20;
    clearRetries();
    for (let i = 0; i < maxRetries; ++i) {
      const success = Math.random() < successRate || i === maxRetries - 1;
      const runtimeMS = requestRuntimeMS +
        Math.round((Math.random() - 0.5) * (requestRuntimeMS / 2)); // +/- 50%
      addRetry(success, runtimeMS);
      if (success) {
        break;
      }
    }
    rerenderResult();
  });
  sliderProps.forEach(prop => {
    const input = document.querySelector(`#${prop}-input`);
    const slider = document.querySelector(`#${prop}-slider`);
    slider.value = state[prop];
    input.value = state[prop];
    input.addEventListener('change', function() {
      const val = input.value;
      if (!isNaN(val)) {
        slider.value = +val;
        state[prop] = +val;
        rerenderResult();
        updateCodeMirror();
        updateChart();
      }
    });
    slider.addEventListener('change', () => {
      input.value = +slider.value;
      state[prop] = +slider.value;
      rerenderResult();
      updateCodeMirror();
      updateChart();
    });
  });
  addRetry(true, 1);
  function clearRetries() {
    state.retries = [];
    retriesListElement.innerHTML = '';
  }
  function updateCodeMirror() {
    codemirror.setValue(JSON.stringify(omit(state, ['retries']), null, '  '));
  }
  function rerenderResult() {
    if (state.retries.length === 0) {
      document.querySelector('.result').innerHTML = '';
    }
    const res = calculateResult();
    if (res.success) {
      resultContainerElement.innerHTML = `<h2>Success after ${res.runtimeMS} ms</h2>`;
      resultContainerElement.classList.add('success');
      resultContainerElement.classList.remove('fail');
    } else {
      resultContainerElement.innerHTML = `<h2>Error after ${res.runtimeMS} ms: ${res.reason}</h2>`;
      resultContainerElement.classList.remove('success');
      resultContainerElement.classList.add('fail');
    }
  }
  function calculateResult() {
    let runtimeMS = 0;
    let retryIntervalMS = state.initialInterval;
    const {
      startToCloseTimeout,
      maximumInterval,
      maximumAttempts,
      backoffCoefficient
    } = state;
    for (let i = 0; i < state.retries.length; ++i) {
      if (i >= maximumAttempts) {
        return {
          success: false,
          runtimeMS,
          reason: 'maximumAttempts'
        }
      }
      runtimeMS = Math.min(runtimeMS + state.retries[i].runtimeMS, startToCloseTimeout);
      if (!state.retries[i].success) {
        runtimeMS = Math.min(runtimeMS + retryIntervalMS, startToCloseTimeout);
      }
      retryIntervalMS = Math.min(retryIntervalMS * backoffCoefficient, maximumInterval);
      if (runtimeMS >= startToCloseTimeout) {
        return {
          success: false,
          runtimeMS,
          reason: 'startToCloseTimeout'
        };
      }
    }
    if (!state.retries[state.retries.length - 1].success) {
      return {
        success: false,
        runtimeMS,
        reason: 'All retries failed'
      };
    }
    return {
      success: true,
      runtimeMS
    };
  }
  function updateChart() {
    const {
      backoffCoefficient,
      startToCloseTimeout,
      initialInterval,
      maximumInterval,
      maximumAttempts
    } = state;
    const labels = [];
    const values = [];
    let interval = initialInterval;
    for (let i = 0; i < maximumAttempts; ++i) {
      labels.push(i + 1);
      values.push(interval);
      interval = Math.min(interval * backoffCoefficient, maximumInterval);
    }
    chart.data.labels = labels;
    chart.data.datasets = [{
      label: 'Time Before Retry',
      backgroundColor: '#168a93',
      borderColor: '#168a93',
      data: values
    }];
    chart.update();
  }
</script>