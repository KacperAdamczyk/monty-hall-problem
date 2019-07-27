import { PerformanceObserver, performance } from 'perf_hooks';
import boxen from 'boxen';

import { Game, GameResult } from './game';
import { random } from './random';

console.log('Iterations: ');
process.stdin.once('data', iterations => {
  const iterationsNumber = +iterations.toString();

  let switchWins = 0;
  let switchLooses = 0;
  let notSwitchWins = 0;
  let notSwitchLooses = 0;

  performance.mark('start');
  for (let i = 0; i < iterationsNumber * 2; i++) {
    const isSwitch = i >= iterationsNumber;
    const game = new Game;

    let output = '';
    output += `GAME ${i + 1}\n`;
    output += game.doorsStatus + '\n';
    game.playerSelect(random(1, 3));
    output += 'Player selected: ' + game.playerSelectedDoors + '\n';
    output += game.doorsStatus + '\n';
    game.hostSelect();
    output += 'Host selected: ' + game.hostSelectedDoors + '\n';
    output += game.doorsStatus + '\n';
    if (isSwitch) {
      game.switch();
      output += 'Player switches\n';
    }
    const endResult = game.finish();
    output += endResult === GameResult.WIN ? 'Player wins!\n' : 'Player looses!\n';
    output += game.doorsStatus;

    console.log(boxen(output, { padding: 1 }));

    if (isSwitch) {
      switchWins += +(endResult === GameResult.WIN);
      switchLooses += +(endResult === GameResult.LOSE);
    } else {
      notSwitchWins += +(endResult === GameResult.WIN);
      notSwitchLooses += +(endResult === GameResult.LOSE);
    }
  }
  performance.mark('end');

  console.log(`Not switch - wins: ${notSwitchWins} looses: ${notSwitchLooses} %: ${notSwitchWins / (notSwitchWins + notSwitchLooses) * 100}`);
  console.log(`Switch - wins: ${switchWins} looses: ${switchLooses} %: ${switchWins / (switchWins + switchLooses) * 100}`);

  performance.measure('time', 'start', 'end');

  process.exit(0);
});

const obs = new PerformanceObserver(items => {
  console.log('time:', +(items.getEntries()[0].duration / 1000).toFixed(2), 's');
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

