import { actions } from './pomodoro.actions';

export var state = {};

state.init = (view) => state.view = view;

state.representation = (model) => {
    var representation = { 
        alert: 'oops... something went wrong, the system is in a invalid state.'
    };

    if (state.ready(model)) {
        representation = state.view.ready(model);
    }

    if (state.working(model)) {
        representation = state.view.working(model);
    }

    if (state.resting(model)) {
        representation = state.view.resting(model);
    }

    if (state.paused(model)) {
        representation = state.view.paused(model);
    }

    state.view.display(representation);
};

state.ready = (model) => {
    return ((model.currentTime === (model.sessionLength*60)) && 
    !model.sessionStarted && 
    !model.breakStarted && 
    !model.paused);
};

state.working = (model) => {
    return ((model.currentTime <= (model.sessionLength*60)) && 
    (model.currentTime >= 0) && 
    model.sessionStarted && 
    !model.breakStarted && 
    !model.paused);
};

state.resting = (model) => {
    return ((model.currentTime <= (model.breakLength*60)) && 
    (model.currentTime >= 0) && 
    model.sessionStarted && 
    model.breakStarted && 
    !model.paused);
};

state.paused = (model) => {
    return ((((model.currentTime <= (model.sessionLength*60)) && !model.breakStarted) ||
    ((model.currentTime <= (model.breakLength*60)) && model.breakStarted)) &&  
    (model.currentTime >= 0) && 
    model.sessionStarted &&
    model.paused);
};

state.nextAction = (model) => {
    if (state.working(model)) {
        if (model.currentTime > 0) {
            actions.decrementTime({ currentTime: model.currentTime }, model.present);
        }

        if (model.currentTime === 0) {
            actions.rest({ currentTime: model.breakLength * 60 }, model.present);
        }
    } else if (state.resting(model)) {
        if (model.currentTime > 0) {
            actions.decrementTime({ currentTime: model.currentTime }, model.present);
        }

        if (model.currentTime === 0) {
            actions.reset({}, model.present);
        }
    }
};

state.render = (model) => {
    state.representation(model);
    state.nextAction(model);
};