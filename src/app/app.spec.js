import pomodoro from './app';

describe('pomodoro', () => {
     it('Start working', () => {
         
         pomodoro.actions.work({});

         expect(pomodoro.states.working()).toBe(true);
     });

});
