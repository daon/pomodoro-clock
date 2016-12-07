import { state } from './pomodoro/pomodoro.state';
import { model } from './pomodoro/pomodoro.model';
import { actions } from './pomodoro/pomodoro.actions';
import { view } from './pomodoro/pomodoro.view';

state.init(view);
model.init(state);
actions.init(model.present);

document.addEventListener('click', actions.eventHandler, false);
view.display(view.init(model)); 