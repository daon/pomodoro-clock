export var theme = {};

theme.minutes = (time) => {
    var minutes = Math.floor(time / 60);
    return minutes < 10 ? `0${minutes}` : minutes;   
};

theme.seconds = (time) => {
    var seconds = time % 60;
    return seconds < 10 ? `0${seconds}` : seconds;
};

theme.settings = function({ breakLength, sessionLength }) {
    return (`
        <div class="settings">
            <section>
                <h2>Break Length</h2>
                <button type="button" onclick="actions.decrementBreakLength({ breakLength: ${breakLength} })">-</button>
                <span>${breakLength}</span>
                <button type="button" onclick="actions.incrementBreakLength({ breakLength: ${breakLength} })">+</button>
            </section>
            <section>
                <h2>Session Length</h2>
                <button type="button" onclick="actions.decrementSessionLength({ sessionLength: ${sessionLength} })">-</button>
                <span>${sessionLength}</span>
                <button type="button" onclick="actions.incrementSessionLength({ sessionLength: ${sessionLength} })">+</button>
            </section>
        </div>
    `);
};

theme.timer = function({ title, time, action }) {
    return (`
        <button type="button" class="clock" onclick="actions.${action}({})">
            ${title}<br/> 
            ${theme.minutes(time)}:${theme.seconds(time)}
        </button>
    `);
};