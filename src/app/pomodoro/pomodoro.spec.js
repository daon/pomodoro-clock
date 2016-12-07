import { state } from './pomodoro.state';
import { model } from './pomodoro.model';
import { actions } from './pomodoro.actions';
import { view } from './pomodoro.view';

describe('Pomodoro', () => {

    beforeEach(() => {
        state.init({ working: () => '', paused: () => '', display: () => true });
        model.init(state);
        actions.init(model.present);
    });

    it('When in state "ready" calling the action "work" should change the state to "working"', () => {
        actions.work({});

        expect(state.working(model)).toBe(true);
    });

    it('When in state "working" calling the action "pause" should change the state to "paused"', () => {
        actions.pause({});

        expect(state.paused(model)).toBe(true);
    });

    it('When in state "paused" calling the action "resume" should change the state to "paused"', () => {
        actions.pause({});

        expect(state.paused(model)).toBe(true);
    });
});