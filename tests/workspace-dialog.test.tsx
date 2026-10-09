import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Dot, State, WorkspaceState } from '../src/shared/types';
import {
  DOT_STARTERS,
  getDotStarter,
  WorkspaceDialog,
} from '../src/client/WorkspaceDialog';

const state = {
  settings: { researchAllowed: true, memoryAllowed: true },
} as unknown as State;
const workspace = {
  spaces: [{ id: 'home', name: 'Home', description: '', createdAt: 0 }],
} as unknown as WorkspaceState;

const renderDialog = (dot?: Dot) =>
  renderToStaticMarkup(
    <WorkspaceDialog
      dialog={{ type: 'dot', spaceId: 'home', dot }}
      state={state}
      workspace={workspace}
      onClose={() => {}}
      mutate={async () => true}
    />
  );

it('offers useful starter roles for new Dots and hides them when editing', () => {
  const createHtml = renderDialog();
  expect(createHtml).toContain('Start with a role');
  for (const starter of DOT_STARTERS) {
    expect(createHtml).toContain('value="' + starter.id + '"');
    expect(createHtml).toContain(starter.label);
  }
  expect(createHtml).toContain('Edit both before saving.');

  const dot: Dot = {
    id: 'scout',
    spaceId: 'home',
    spaceIds: ['home'],
    name: 'Scout',
    instructions: 'Research carefully.',
    researchAllowed: true,
    memoryAllowed: true,
    createdAt: 0,
  };
  expect(renderDialog(dot)).not.toContain('Start with a role');
});

it('provides starter details and returns no match for unknown roles', () => {
  expect(getDotStarter('research')?.name).toBe('Research Partner');
  expect(getDotStarter('research')?.instructions).toContain('subquestions');
  expect(getDotStarter('writing')?.name).toBe('Writing Partner');
  expect(getDotStarter('planning')?.name).toBe('Project Planner');
  expect(getDotStarter('unknown')).toBeUndefined();
});
