import React from 'react';
import './App.scss';
import Kanban from './components/Kanban/Kanban';
import KanbanDB from 'kanbandb';
let instance;

async function initialize() {
  /**
   * Use KanbanDB like so (but you might want to move it) - types are provided
   * by jsconfig.json, which will utilize d.ts files and give you autocompletion for
   * KanbanDB, in Visual Studio Code, if that is your preferred IDE.
   * 
   * This code (initialize function) is for demonstration only.
   */
  instance = await KanbanDB.connect(null);
  // instance.addCard({
  //     name: 'testin',
  //     description: 'testin',
  //     status: 'TODO'
  // })
  return instance
}

function App() {
  const a = initialize();

  return (
    <div className="App">
      <h1>
        Kanban Board
      </h1>
      <Kanban instance={a} />
    </div>
  );
}

export default App;

