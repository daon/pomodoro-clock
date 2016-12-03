const DEFAULT_SESSION_LENGTH = 5;
const DEFAULT_BREAK_LENGTH = 5;

var model  = {};

model.reset = () => {
    model.sessionLength = DEFAULT_SESSION_LENGTH;
    model.breakLength = DEFAULT_BREAK_LENGTH;
    model.time = model.sessionLength;
    model.sessionStarted = false;
    model.breakStarted = false;
    model.paused = false;
};

model.present = (data) => {
    if (state.counting(model)) {
        if (data.reseted) {
            model.reset();
        } else if (model.counter === 0) {
            model.launched = data.launched || false;
        } else {
            model.paused = data.paused || false;
            if (data.counter !== undefined) { 
                model.counter = data.counter;
            }
        }
    } else if(state.paused(model)) {
        if (data.resumed) {
            model.paused = false;
        } else if (data.reseted) {
            model.reset();
        }
    } else if (state.ready(model)) {
        model.started = data.started || false;
    }
    state.render(model);
};

model.reset();

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
        `<button type="button" class="clock" data-action="start">
            ${getMinutes(model.counter)}:${getSeconds(model.counter)}
        </button>
        `
    );
};

view.counting = (model) => {
    return (
        `<button type="button" class="clock" data-action="pause">
            ${getMinutes(model.counter)}:${getSeconds(model.counter)}
        </button>
        `
    );
};

view.paused = (model) => {
    return (
        `<button type="button" class="clock" data-action="resume">
            ${getMinutes(model.counter)}:${getSeconds(model.counter)}
        </button>
        `
    );
};

view.launched = (model) => {
    return (
        `<button type="button" class="clock" data-action="reset">
            ${getMinutes(model.counter)}:${getSeconds(model.counter)}
        </button>
        `
    );
};

view.eventHandler = (event) => {
    let element = event.target;

    if (!element) {
        return;
    };

    if (element.hasAttribute('data-action')) {
        let action = element.getAttribute('data-action');
        actions[action]({});
    }
};

view.display = (representation) => {
    let stateRepresentation = document.getElementById("representation");
    stateRepresentation.innerHTML = representation;
};

document.addEventListener('click', view.eventHandler, false);
view.display(view.init(model));

var state = { view: view };

model.state = state;

state.representation = (model) => {
    var representation = 'oops... something went wrong, the system is in a invalid state.';

    if (state.ready(model)) {
        representation = state.view.ready(model);
    }

    if (state.working(model)) {
        representation = state.view.counting(model);
    }

    if (state.resting(model)) {
        representation = state.view.launched(model);
    }

    if (state.paused(model)) {
        representation = state.view.paused(model);
    }

    state.view.display(representation);
};

state.ready = (model) => {
    return ((model.timer === model.sessionLength) && 
    !model.sessionStarted && 
    !model.breakStarted && 
    !model.paused);
};

state.working = (model) => {
    return ((model.timer <= model.sessionLength) && 
    (model.timer >= 0) && 
    model.sessionStarted && 
    !model.breakStarted && 
    !model.paused);
};

state.resting = (model) => {
    return ((model.timer <= model.breakLength) && 
    (model.timer >= 0) && 
    model.sessionStarted && 
    model.breakStarted && 
    !model.paused);
};

state.sessionPaused = (model) => {
    return ((model.timer <= model.sessionLength) && 
    (model.timer >= 0) && 
    model.sessionStarted &&
    !model.breakStarted &&
    model.paused);
};

state.breakPaused = (model) => {
    return ((model.timer <= model.breakLength) && 
    (model.timer >= 0) && 
    model.sessionStarted &&
    model.breakStarted &&
    model.paused);
};

state.nextAction = (model) => {
    if (state.working(model)) {
        if (model.timer > 0) {
            actions.decrement({ timer: model.timer }, model.present);
        }

        if (model.timer === 0) {
            actions.reset({}, model.present);
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
    data.timer = data.timer || 10;
    let d = data;
    let p = present;
    setTimeout(() => {
        d.timer = d.timer - 1;
        p(d);
    }, 1000);
};

actions.pause = (data, present) => {
    present = present || model.present;
    data.paused = true;
    present(data);
    return false;
};

actions.resume = (data, present) => {
    present = present || model.present;
    data.resumed = true;
    present(data);
    return false;
};

actions.reset = (data, present) => {
    present = present || model.present;
    data.reseted = true;
    present(data);
    return false;
};