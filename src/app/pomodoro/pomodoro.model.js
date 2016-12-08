'use strict';

const DEFAULT_SESSION_LENGTH = 25;
const DEFAULT_BREAK_LENGTH = 5;

export var model = {
    sessionLength: DEFAULT_SESSION_LENGTH,
    breakLength: DEFAULT_BREAK_LENGTH,
    currentTime: DEFAULT_SESSION_LENGTH * 60,
    sessionStarted: false,
    breakStarted: false,
    paused: false
};

model.init = (state) => model.state = state;

model.present = (data) => {
    if (model.state.working(model)) {
        if (model.currentTime === 0) {
            model.breakStarted = data.breakStarted || false;
            model.currentTime = data.currentTime || 0;
        } else {
            model.paused = data.paused || false;
            if (data.currentTime !== undefined) { 
                model.currentTime = data.currentTime;
            }
        }
    } else if(model.state.resting(model)) {
        model.paused = data.paused || false;
        if (data.currentTime !== undefined) { 
            model.currentTime = data.currentTime;
        }
    } else if(model.state.paused(model)) {
        if (data.resumed) {
            model.paused = false;
        }
    } else if (model.state.ready(model)) {
        model.sessionStarted = data.sessionStarted || false;
    }
    model.state.render(model);
};