import { SPELL_CHECKING_LANGUAGE_TOGGLED } from '../common/actions/spellCheckingActions';
import { dispatch } from '../common/store';
import { withStore } from '../common/withStore';
import { createMainReduxStore } from './createMainReduxStore';
import { setupSpellChecking } from './setupSpellChecking';

describe('setupSpellChecking', () => {
  beforeAll(async () => {
    withStore(await createMainReduxStore());
  });

  it('works', async () => {
    await setupSpellChecking();
  });

  it('handles invalid languages', async () => {
    await setupSpellChecking();
    dispatch({
      type: SPELL_CHECKING_LANGUAGE_TOGGLED,
      payload: {
        name: 'wtf',
        enabled: true,
      },
    });
  });
});
