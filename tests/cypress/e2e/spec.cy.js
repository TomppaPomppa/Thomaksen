describe('Todo app', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear localStorage before each test for isolation
    cy.clearLocalStorage();
  });

  it('creates a new task and displays it in the list', () => {
    // Fill in the form
    cy.get('#topic').type('Testitaski').should('have.value', 'Testitaski');
    cy.get('#description')
      .type('Testitaskin kuvaus')
      .should('have.value', 'Testitaskin kuvaus');

    // Submit the form
    cy.get('#save-btn').click();

    // Verify the task appears in the list
    cy.get('#task-list').should('be.visible');
    cy.get('#task-list .task').should('have.length', 1);

    // Check the task contains correct content
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('.title').should('contain', 'Testitaski');
        cy.get('.desc').should('contain', 'Testitaskin kuvaus');
      });

    // Verify empty state is hidden
    cy.get('#empty-state').should('not.be.visible');

    // Verify task is persisted in localStorage
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(1);
      expect(tasks[0].topic).to.equal('Testitaski');
      expect(tasks[0].description).to.equal('Testitaskin kuvaus');
      expect(tasks[0].priority).to.equal('medium'); // default value
      expect(tasks[0].status).to.equal('todo'); // default value
      expect(tasks[0].completed).to.be.false;
    });
  });

  // Modify existing task
  it('Modify existing task', () => {
    // create a task first
    cy.get('#topic').type('Editable task');
    cy.get('#description').type('Old description');
    cy.get('#save-btn').click();

    // open edit for the first task
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('button[data-action="edit"]').click();
      });

    // ensure form is in edit mode
    cy.get('#form-title').should('contain', 'Edit Task');
    cy.get('#save-btn').should('contain', 'Update Task');

    // change fields
    cy.get('#topic').clear().type('Edited task');
    cy.get('#description').clear().type('New description');
    cy.get('#priority').select('high');
    cy.get('#status').select('in-progress');

    // submit update
    cy.get('#save-btn').click();

    // UI assertions
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('.title').should('contain', 'Edited task');
        cy.get('.desc').should('contain', 'New description');
      });

    // localStorage assertions
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(1);
      expect(tasks[0].topic).to.equal('Edited task');
      expect(tasks[0].description).to.equal('New description');
      expect(tasks[0].priority).to.equal('high');
      expect(tasks[0].status).to.equal('in-progress');
    });
  });

  it('deletes a task and verifies it is removed', () => {
    // First, create a task
    cy.get('#topic').type('Poistettava taski');
    cy.get('#description').type('Tämä poistetaan');
    cy.get('#save-btn').click();

    // Verify task was created
    cy.get('#task-list .task').should('have.length', 1);
    cy.get('#task-list .task .title').should('contain', 'Poistettava taski');

    // Delete the task
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('button[data-action="delete"]').click();
      });

    // Verify task is removed from the list
    cy.get('#task-list .task').should('have.length', 0);

    // Verify empty state is displayed
    cy.get('#empty-state').should('be.visible');

    // Verify task is removed from localStorage
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(0);
    });
  });
  it('filters tasks by priority', () => {
    // create high
    cy.get('#topic').clear().type('High task');
    cy.get('#description').clear().type('High desc');
    cy.get('#priority').select('high');
    cy.get('#save-btn').click();

    // create medium
    cy.get('#topic').clear().type('Medium task');
    cy.get('#description').clear().type('Medium desc');
    cy.get('#priority').select('medium');
    cy.get('#save-btn').click();

    // create low
    cy.get('#topic').clear().type('Low task');
    cy.get('#description').clear().type('Low desc');
    cy.get('#priority').select('low');
    cy.get('#save-btn').click();

    // ensure all three created
    cy.get('#task-list .task').should('have.length', 3);

    // filter high
    cy.get('#filter-priority').select('high');
    cy.get('#task-list .task').should('have.length', 1);
    cy.get('#task-list .task .title').should('contain', 'High task');

    // filter medium
    cy.get('#filter-priority').select('medium');
    cy.get('#task-list .task').should('have.length', 1);
    cy.get('#task-list .task .title').should('contain', 'Medium task');

    // filter low
    cy.get('#filter-priority').select('low');
    cy.get('#task-list .task').should('have.length', 1);
    cy.get('#task-list .task .title').should('contain', 'Low task');

    // show all
    cy.get('#filter-priority').select('all');
    cy.get('#task-list .task').should('have.length', 3);
  });
});
