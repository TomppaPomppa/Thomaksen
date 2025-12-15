/** @vitest-environment jsdom */
import { beforeEach, afterEach, it, expect, describe, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function seedTasks(items = []) {
  const now = Date.now();
  const tasks = items.map((it, i) => ({
    id: it.id || `t_${i + 1}`,
    topic: it.topic || `Topic ${i + 1}`,
    priority: it.priority || 'medium',
    status: it.status || 'todo',
    description: it.description || `Desc ${i + 1}`,
    completed: !!it.completed,
    createdAt: it.createdAt || now - i * 1000,
    updatedAt: it.updatedAt || now - i * 1000,
  }));
  localStorage.setItem('todo_tasks_v1', JSON.stringify(tasks));
  return tasks;
}
describe('Todo-sovelluksen testaus', () => {
  beforeEach(() => {
    vi.resetModules(); // tärkeä — tyhjennä import-välimuisti jotta app.js suoritetaan uudelleen
    const htmlPath = resolve(process.cwd(), 'public', 'index.html');
    const html = readFileSync(htmlPath, 'utf8');
    const cleaned = html.replace(
      /<script\b[^>]*src="[^"]*app\.js"[^>]*><\/script>/i,
      ''
    );
    document.documentElement.innerHTML = cleaned;
    localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    // clean up global app if set
    if (typeof window !== 'undefined' && window.app) delete window.app;
    document.documentElement.innerHTML = '';
    localStorage.clear();
  });
  it('creates a task', async () => {
    await import('../public/app.js'); // lataa app vasta DOM:n jälkeen

    const topic = document.getElementById('topic');
    const priority = document.getElementById('priority');
    const status = document.getElementById('status');
    const description = document.getElementById('description');
    const form = document.getElementById('task-form');

    topic.value = 'Testitehtävä';
    priority.value = 'high';
    status.value = 'todo'; // korjattu arvo
    description.value = 'Testikuvaus';

    form.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );

    const raw = localStorage.getItem('todo_tasks_v1'); // oikea avain
    const tasks = JSON.parse(raw || '[]');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].topic).toBe('Testitehtävä');
    expect(tasks[0].priority).toBe('high');
    expect(tasks[0].description).toBe('Testikuvaus');

    const list = document.getElementById('task-list');
    expect(list.querySelectorAll('li').length).toBe(1);
  });
  it('Tehtävien luettelointi ja luettavuus: renderöi ja näyttää otsikon/kuvauksen/prioriteetin', async () => {
    const seeded = seedTasks([
      {
        topic: 'Kirjoita testi',
        description: 'Kirjoita yksikkötesti',
        priority: 'high',
      },
      {
        topic: 'Refaktoroi',
        description: 'Paranna koodin laatua',
        priority: 'low',
      },
    ]);

    await import('../public/app.js');

    const items = document.querySelectorAll('#task-list .task');
    expect(items.length).toBe(2);

    const first = items[0];
    expect(first.querySelector('.title').textContent).toContain(
      seeded[0].topic
    );
    expect(first.querySelector('.desc').textContent).toContain(
      seeded[0].description
    );
    // priority badge presence (prio-high for high)
    expect(first.querySelector('.badge.prio-high')).not.toBeNull();
  });

  it('Tehtävän päivitys: valmis/kesken toggle päivittää completed-tilan', async () => {
    seedTasks([{ topic: 'Toggle test', completed: false }]);

    await import('../public/app.js');

    const completeBtn = document.querySelector(
      '#task-list .task button[data-action="complete"]'
    );
    expect(completeBtn).not.toBeNull();

    // click to mark complete
    completeBtn.click();
    let stored = JSON.parse(localStorage.getItem('todo_tasks_v1') || '[]');
    expect(stored[0].completed).toBe(true);
    // UI has done class
    const li = document.querySelector('#task-list .task');
    expect(li.classList.contains('done')).toBe(true);

    // click again to undo
    const undoBtn = document.querySelector(
      '#task-list .task button[data-action="complete"]'
    );
    undoBtn.click();
    stored = JSON.parse(localStorage.getItem('todo_tasks_v1') || '[]');
    expect(stored[0].completed).toBe(false);
  });

  it('Tehtävän poisto: vahvistusdialogi hyväksytään -> tehtävä poistuu', async () => {
    seedTasks([{ topic: 'Poistettava' }]);

    await import('../public/app.js');

    // stub window.confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const delBtn = document.querySelector(
      '#task-list .task button[data-action="delete"]'
    );
    expect(delBtn).not.toBeNull();
    delBtn.click();

    const items = document.querySelectorAll('#task-list .task');
    expect(items.length).toBe(0);

    const stored = JSON.parse(localStorage.getItem('todo_tasks_v1') || '[]');
    expect(stored.length).toBe(0);
  });

  it('Tehtävän poisto: vahvistusdialogi perutaan -> tehtävä säilyy', async () => {
    seedTasks([{ topic: 'Ei-poisteta' }]);

    await import('../public/app.js');

    // stub window.confirm to return false
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    const delBtn = document.querySelector(
      '#task-list .task button[data-action="delete"]'
    );
    delBtn.click();

    const items = document.querySelectorAll('#task-list .task');
    expect(items.length).toBe(1);

    const stored = JSON.parse(localStorage.getItem('todo_tasks_v1') || '[]');
    expect(stored.length).toBe(1);
  });
});
