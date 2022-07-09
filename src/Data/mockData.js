import { v4 as uuidv4 } from 'uuid'

const mockData = [
    {
        id: uuidv4(),
        title: ' 📃 To-do',
        key: 'TODO',
        tasks: [
            {
                id: uuidv4(),
                name: 'Learn JavaScript'
            },
            {
                id: uuidv4(),
                name: 'Learn Git'
            },
            {
                id: uuidv4(),
                name: 'Learn Python'
            },

        ]
    },
    {
        id: uuidv4(),
        title: ' ✏️ In Progress',
        key: 'IN_PROGRESS',
        tasks: [
            {
                id: uuidv4(),
                name: 'Learn CSS'
            },
            {
                id: uuidv4(),
                name: 'Learn Golang'
            }
        ]
    },
    {
        id: uuidv4(),
        title: ' ✔️ Completed',
        key: 'DONE',
        tasks: [
            {
                id: uuidv4(),
                name: 'Learn HTML'
            }
        ]
    }
]

export default mockData