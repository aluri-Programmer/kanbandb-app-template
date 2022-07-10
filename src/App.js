import React, { Component } from 'react'
import './App.scss';
import Kanban from './components/Kanban/Kanban';
import KanbanDB from 'kanbandb';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kanbandb: KanbanDB.connect(), // Initialize DB communications.
    };
  }
  render() {
    return (
      <div className="App">
        <h1>
          Kanban Board
        </h1>
        <Kanban instance={this.state.kanbandb} />
      </div>
    )
  }
}