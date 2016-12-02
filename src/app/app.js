const COUNTER_MAX = 1500;

var model  = {
    counter: COUNTER_MAX,
    started: false,
    launched: false,
    paused: false 
};

model.present = (data) => {
    if (state.counting(model)) {
        if (model.counter === 0) {
            model.launched = data.launched || false;
        } else {
            model.aborted = data.aborted || false;
            if (data.counter !== undefined) { 
                model.counter = data.counter;
            }
        }
    } else {
        if (state.ready(model)) {
            model.started = data.started || false;
        }
    }
    state.render(model);
};

var getMinutes = (counter) => {
    var minutes = Math.floor(counter/60);
    return minutes < 10 ? `0${minutes}` : minutes;   
};

var getSeconds = (counter) => {
    var seconds = counter % 60;
    return seconds < 10 ? `0${seconds}` : seconds;
};


var view = {};

view.init = (model) => {
    return view.ready(model);
};

view.ready = (model) => {
    return (
        `<p>${getMinutes(model.counter)}:${getSeconds(model.counter)}</p>
        <button type="button" data-action="start">Start</button>
        `
    );
};

view.counting = (model) => {
    return (
        `<p>${getMinutes(model.counter)}:${getSeconds(model.counter)}</p>
        <button type="button" data-action="pause">Pause</button>
        <button type="button" data-action="reset">Reset</button>`
    );
};

view.paused = (model) => {
    return (
        `<p>Paused at ${getMinutes(model.counter)}:${getSeconds(model.counter)}</p>
        <button type="button" data-action="start">Start</button>
        <button type="button" data-action="reset">Reset</button>`
    );
};

view.launched = (model) => {
    return (
        `<p>Launched</p>`
    );
};

view.display = (representation) => {
    let stateRepresentation = document.getElementById("representation");
    stateRepresentation.addEventListener('click', (event) => {
        let element = event.target;

        if (!element) {
            return;
        };

        if (element.hasAttribute('data-action')) {
            let action = element.getAttribute('data-action');
            return actions[action]({});
        }

    }, false);

    stateRepresentation.innerHTML = representation;
};

view.display(view.init(model));

var state = { view: view };

model.state = state;

state.representation = (model) => {
    var representation = 'oops... something went wrong, the system is in a invalid state.';

    if (state.ready(model)) {
        representation = state.view.ready(model);
    }

    if (state.counting(model)) {
        representation = state.view.counting(model);
    }

    if (state.launched(model)) {
        representation = state.view.launched(model);
    }

    if (state.aborted(model)) {
        representation = state.view.aborted(model);
    }

    state.view.display(representation);
};

state.ready = (model) => {
    return ((model.counter === COUNTER_MAX) && !model.started && !model.launched && !model.aborted);
};

state.counting = (model) => {
    return ((model.counter <= COUNTER_MAX) && (model.counter >= 0) && model.started && !model.launched && !model.aborted);
};

state.launched = (model) => {
    return ((model.counter === 0) && model.started && model.launched && !model.aborted);
};

state.aborted = (model) => {
    return ((model.counter <= COUNTER_MAX) && (model.counter >= 0) && model.started && !model.launched && model.aborted);
};

state.nextAction = (model) => {
    if (state.counting(model)) {
        if (model.counter > 0) {
            actions.decrement({ counter: model.counter }, model.present);
        }

        if (model.counter === 0) {
            actions.launch({}, model.present);
        }
    }
};

state.render = (model) => {
    state.representation(model);
    state.nextAction(model);
};

var actions = {};

actions.start = (data, present) => {
    present = present || model.present;
    data.started = true;
    present(data);
    return false;
};

actions.decrement = (data, present) => {
    present = present || model.present;
    data = data || {};
    data.counter = data.counter || 10;
    let d = data;
    let p = present;
    setTimeout(() => {
        d.counter = d.counter - 1;
        p(d);
    }, 1000);
};

actions.launch = (data, present) => {
    present = present || model.present;
    data.launched = true;
    present(data);
    return false;
};

actions.abort = (data, present) => {
    present = present || model.present;
    data.aborted = true;
    present(data);
    return false;
};