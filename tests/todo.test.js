// /** @vitest-environment jsdom */
// // import { beforeEach, it, expect } from 'vitest';

// // beforeEach(() => {
// //   document.body.innerHTML = `
// //     <form id="task-form">...</form>
// //     <input id="topic" />
// //     <select id="priority">...</select>
// //     <select id="status">...</select>
// //     <textarea id="description"></textarea>
// //     <button id="save-btn" type="submit"></button>
// //     <button id="reset-btn" type="button"></button>
// //     <ul id="task-list"></ul>
// //     <div id="empty-state"></div>
// //   `;
// //   localStorage.clear();
// // });

// // it('creates a task', async () => {
// //   const mod = await import('../public/app.js'); // import after DOM exists
// //   const app = mod.default;
// //   // …fill fields and dispatch submit, then assert localStorage / DOM
// // });
// // it('Luo Tehtävä', () => {
// //   const topic = document.getElementById('topic');
// //   const priority = document.getElementById('priority');
// //   const status = document.getElementById('status');
// //   const description = document.getElementById('description');
// //   const form = document.getElementById('task-form');

// //   topic.value = 'Testitehtävä';
// //   priority.value = 'high';
// //   status.value = 'document';
// //   description.value = 'Testikuvaus';

// //   form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

// //   const raw = localStorage.getItem('document_tasks_v1');
// //   const tasks = JSON.parse(raw || '[]');

// //   expect(tasks).toHaveLength(1);
// //   expect(tasks[0].topic).toBe('Testitehtävä');
// //   expect(tasks[0].priority).toBe('high');
// //   expect(tasks[0].description).toBe('Testikuvaus');

// //   const list = document.getElementById('task-list');
// //   expect(list.querySelectorAll('li').length).toBe(1);
// // });
