export var view = {};

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
        <button type="button" class="clock" onclick="actions.work({})">
            Session 
            ${view.minutes(model)}:${view.seconds(model)}
        </button>
        `
    );
};

view.working = (model) => {
    return (
        `<button type="button" class="clock" onclick="actions.pause({})">
            Session
            ${view.minutes(model)}:${view.seconds(model)}
        </button>
        `
    );
};

view.resting = (model) => {
    return (
        `<button type="button" class="clock" onclick="actions.pause({})">
            Break<br/>
            ${view.minutes(model)}:${view.seconds(model)}
        </button>
        `
    );
};

view.paused = (model) => {
    return (
        `<button type="button" class="clock" onclick="actions.resume({})">
            Pause<br/>
            ${view.minutes(model)}:${view.seconds(model)}
        </button>
        `
    );
};

view.display = (representation) => {
    let stateRepresentation = document.getElementById("representation");
    stateRepresentation.innerHTML = representation;
};
