import { v4 as uuidv4 } from 'uuid'
// name: "Test",
// description: "Write tests for TextField",
// status: STATUS.TODO,
const TODO = 'TODO';
const IN_PROGRESS = 'IN_PROGRESS';
const DONE = 'DONE';

export const STATUS = {
    [TODO]: 0,
    [IN_PROGRESS]: 1,
    [DONE]: 2
}

export const mockStructure = [
    {
        id: uuidv4(),
        title: ' 📃 To-do',
        key: 'TODO',
        tasks: []
    },
    {
        id: uuidv4(),
        title: ' ✏️ In Progress',
        key: 'IN_PROGRESS',
        tasks: [

        ]
    },
    {
        id: uuidv4(),
        title: ' ✔️ Completed',
        key: 'DONE',
        tasks: [

        ]
    }
]


export const mockTodoList = [
    {
        name: 'Learn JavaScript',
        description: "Write tests for TextField",
        status: TODO,
    },
    {
        name: 'Learn Git',
        description: "Write tests for TextField",
        status: TODO,
    },
    {
        name: 'Learn Git',
        description: "Write tests for TextField",
        status: TODO,
    },
    {
        name: 'Learn CSS',
        description: "Write tests for TextField",
        status: IN_PROGRESS,
    },
    {
        name: 'Learn Golang',
        description: "Write tests for TextField",
        status: IN_PROGRESS,
    },
    {
        name: 'Learn HTML',
        description: "Write tests for TextField",
        status: DONE,
    }
]