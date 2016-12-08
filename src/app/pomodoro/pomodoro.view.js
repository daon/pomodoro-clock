import { theme } from './pomodoro.theme';

export var view = {};

view.init = (model) => {
    return view.ready(model);
};

view.ready = (model) => {
    return ({
        settings: theme.settings({ breakLength: model.breakLength, sessionLength: model.sessionLength }),
        timer: theme.timer({title: 'Session', time: model.currentTime, action: 'work' })
    });
};

view.working = (model) => {
    return ({
        settings: theme.settings({ breakLength: model.breakLength, sessionLength: model.sessionLength }),
        timer: theme.timer({ title: 'Session', time: model.currentTime, action: 'pause' })
    });
};

view.resting = (model) => {
    return ({
        settings: theme.settings({ breakLength: model.breakLength, sessionLength: model.sessionLength }),
        timer: theme.timer({ title: 'Break', time: model.currentTime, action: 'pause' })
    });
};

view.paused = (model) => {
    return ({
        settings: theme.settings({ breakLength: model.breakLength, sessionLength: model.sessionLength }),
        timer: theme.timer({ title: 'Pause', time: model.currentTime, action: 'resume' })
    });
};

view.display = (representation) => {
    Object
        .keys(representation)
        .forEach((el) => {
            const component = document.getElementById(el);
            component.innerHTML = representation[el];
        });
};
