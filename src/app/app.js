var pomodoro = (() => {
    'use strict';
    const DEFAULT_SESSION_LENGTH = 25;
    const DEFAULT_BREAK_LENGTH = 5;

    var model  = {};

    model.reset = () => {
        model.sessionLength = DEFAULT_SESSION_LENGTH;
        model.breakLength = DEFAULT_BREAK_LENGTH;
        model.currentTime = model.sessionLength*60;
        model.sessionStarted = false;
        model.breakStarted = false;
        model.paused = false;
    };

    model.present = (data) => {
        if (state.working(model)) {
            if (data.reseted) {
                model.reset();
            } else if (model.currentTime === 0) {
                model.breakStarted = data.breakStarted || false;
                model.currentTime = data.currentTime || 0;
            } else {
                model.paused = data.paused || false;
                if (data.currentTime !== undefined) { 
                    model.currentTime = data.currentTime;
                }
            }
        } else if(state.resting(model)) {
            if (data.reseted) {
                model.reset();
            } else {
                model.paused = data.paused || false;
                if (data.currentTime !== undefined) { 
                    model.currentTime = data.currentTime;
                }
            }
        } else if(state.paused(model)) {
            if (data.resumed) {
                model.paused = false;
            } else if (data.reseted) {
                model.reset();
            }
        } else if (state.ready(model)) {
            model.sessionStarted = data.sessionStarted || false;
        }
        state.render(model);
    };

    model.reset();

    var view = {};

    view.init = (model) => {
        return view.ready(model);
    };


    view.minutes = (model) => {
        var minutes = Math.floor(model.currentTime/60);
        return minutes < 10 ? `0${minutes}` : minutes;   
    };

    view.seconds = (model) => {
        var seconds = model.currentTime % 60;
        return seconds < 10 ? `0${seconds}` : seconds;
    };

    view.ready = (model) => {
        return (
            `
            <div class="settings">
                <section>
                    <h2>Break Length</h2>
                    <button type="button" data-action="decrementBreakLength">-</button>
                    <span>${model.breakLength}</span>
                    <button type="button" data-action="incrementBreakLength">+</button>
                </section>
                <section>
                    <h2>Session Length</h2>
                    <button type="button" data-action="decrementSessionLength">-</button>
                    <span>${model.sessionLength}</span>
                    <button type="button" data-action="incrementSessionLength">+</button>
                </section>
            </div>
            <button type="button" class="clock" data-action="work">
                Session 
                ${view.minutes(model)}:${view.seconds(model)}
            </button>
            `
        );
    };

    view.working = (model) => {
        return (
            `<button type="button" class="clock" data-action="pause">
                Session
                ${view.minutes(model)}:${view.seconds(model)}
            </button>
            `
        );
    };

    view.resting = (model) => {
        return (
            `<button type="button" class="clock" data-action="pause">
                Break<br/>
                ${view.minutes(model)}:${view.seconds(model)}
            </button>
            `
        );
    };

    view.paused = (model) => {
        return (
            `<button type="button" class="clock" data-action="resume">
                Pause<br/>
                ${view.minutes(model)}:${view.seconds(model)}
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
            let actionName = element.getAttribute('data-action');
            let action = actions[actionName];
            if (action === undefined) {
                console.error(`Action with name: ${actionName} is not available.`);
                return;
            }
            
            action({});
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
        return ((model.currentTime === model.sessionLength) && 
        !model.sessionStarted && 
        !model.breakStarted && 
        !model.paused);
    };

    state.working = (model) => {
        return ((model.currentTime <= model.sessionLength) && 
        (model.currentTime >= 0) && 
        model.sessionStarted && 
        !model.breakStarted && 
        !model.paused);
    };

    state.resting = (model) => {
        return ((model.currentTime <= model.breakLength) && 
        (model.currentTime >= 0) && 
        model.sessionStarted && 
        model.breakStarted && 
        !model.paused);
    };

    state.paused = (model) => {
        return ((((model.currentTime <= model.sessionLength) && !model.breakStarted) ||
        ((model.currentTime <= model.breakLength) && model.breakStarted)) &&  
        (model.currentTime >= 0) && 
        model.sessionStarted &&
        model.paused);
    };

    state.nextAction = (model) => {
        if (state.working(model)) {
            if (model.currentTime > 0) {
                actions.decrement({ currentTime: model.currentTime }, model.present);
            }

            if (model.currentTime === 0) {
                actions.rest({}, model.present);
            }
        } else if (state.resting(model)) {
            if (model.currentTime > 0) {
                actions.decrement({ currentTime: model.currentTime }, model.present);
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

    var actions = {};

    actions.work = (data, present) => {
        present = present || model.present;
        data.sessionStarted = true;
        present(data);
        return false;
    };

    actions.rest = (data, present) => {
        present = present || model.present;
        data.breakStarted = true;
        data.currentTime = model.breakLength;
        present(data);
        return false;
    }

    actions.decrement = (data, present) => {
        present = present || model.present;
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

    return {
        model: model,
        view: view,
        state: state,
        actions: actions
    };
})();

export default pomodoro;