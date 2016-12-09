import { DEFAULT_BREAK_LENGTH, DEFAULT_SESSION_LENGTH } from './pomodoro.model'

export var actions = {};

actions.init = (present) => actions.present = present;

actions.work = (data, present) => {
    present = present || actions.present;
    data.sessionStarted = true;
    present(data);
    return false;
};

actions.rest = (data, present) => {
    present = present || actions.present;
    data.breakStarted = true;
    data.currentTime = data.currentTime || DEFAULT_BREAK_LENGTH * 60;
    present(data);
    return false;
}

actions.decrementTime = (data, present) => {
    present = present || actions.present;
    data = data || {};
    data.currentTime = data.currentTime || DEFAULT_SESSION_LENGTH * 60;
    let d = data;
    let p = present;
    setTimeout(() => {
        d.currentTime = d.currentTime - 1;
        p(d);
    }, 1000);
};

actions.decrementBreakLength = (data, present) => {
    present = present || actions.present;
    data = data || {};
    data.breakLength = data.breakLength || DEFAULT_BREAK_LENGTH;
    data.breakLength = data.breakLength - 1;
    present(data);
};

actions.incrementBreakLength = (data, present) => {
    present = present || actions.present;
    data = data || {};
    data.breakLength = data.breakLength || DEFAULT_BREAK_LENGTH;
    data.breakLength = data.breakLength + 1;
    present(data);
};

actions.decrementSessionLength = (data, present) => {
    present = present || actions.present;
    data = data || {};
    data.sessionLength = data.sessionLength || DEFAULT_SESSION_LENGTH;
    data.sessionLength = data.sessionLength - 1;
    present(data);
};

actions.incrementSessionLength = (data, present) => {
    present = present || actions.present;
    data = data || {};
    data.sessionLength = data.sessionLength || DEFAULT_SESSION_LENGTH;
    data.sessionLength = data.sessionLength + 1;
    present(data);
};

actions.pause = (data, present) => {
    present = present || actions.present;
    data.paused = true;
    present(data);
    return false;
};

actions.resume = (data, present) => {
    present = present || actions.present;
    data.resumed = true;
    present(data);
    return false;
};

actions.reset = (data, present) => {
    present = present || actions.present;
    data.reseting = true;
    present(data);
    return false;
};