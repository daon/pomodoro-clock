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
    present(data);
    return false;
}

actions.decrement = (data, present) => {
    present = present || actions.present;
    data = data || {};
    data.currentTime = data.currentTime || 10;
    let d = data;
    let p = present;
    setTimeout(() => {
        d.currentTime = d.currentTime - 1;
        p(d);
    }, 1000);
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
    data.reseted = true;
    present(data);
    return false;
};

actions.eventHandler = (event) => {
    let element = event.target;

    if (!element) {
        return;
    };

    if (element.hasAttribute('data-action')) {
        let actionName = element.getAttribute('data-action');
        let action = actions[actionName];
        if (action === undefined) {
            console.error(`Action with name: ${actionName} is not available.`);
            return;
        }
        
        action({});
    }
};