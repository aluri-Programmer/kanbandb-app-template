import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import Card from '../Card/Card'
import mockData from '../../Data/mockData'
import './Kanban.scss'



const Kanban = (props) => {
    console.log('props', props)

    const taskStates = {
        'TODO': 0,
        'IN_PROGRESS': 1,
        'DONE': 2
    }

    const [data, setData] = useState(mockData)
    const [newTodo, setNewTodo] = useState('')
    const [newTodoStatus, setNewTodoStatus] = useState('TODO')



    const getCards = async () => {
        try {
            const inst = await props.instance;

            console.log('inst', inst)
            const cards = await inst.getCards()
            console.log('cards', cards)
            const currentTasks = Object.assign([], data)
            // const getCurrentIndex = currentTasks.findIndex(r => r.key === newRecord.status);
            // currentTasks[getCurrentIndex].tasks.push(newRecord)
            // setData(currentTasks)

            // [
            //     {
            //         "id": "495f8829-3898-4bc3-8a43-12caf5e3250d",
            //         "name": "testin",
            //         "description": "testin",
            //         "status": "TODO",
            //         "created": 1657384021468,
            //         "lastUpdated": 1657384021468
            //     },
            // ]

            // taskStates

            cards.forEach(card => {
                const taskIndex = taskStates[card.status]
                currentTasks[taskIndex].tasks.push(card)
            });

            setData(currentTasks)
        } catch (error) {
            console.log('error', error)
        }
    }

    React.useEffect(() => {
        // Initialize DB communications.

        getCards();
    }, [])

    const resetStates = () => {
        setNewTodo('')
        setNewTodoStatus('TODO')
    }

    const addNewTask = async () => {
        try {
            const inst = await props.instance;
            const newId = await inst.addCard({
                name: newTodo,
                description: newTodo,
                status: newTodoStatus
            })

            const newRecord = await inst.getCardById(newId);
            const currentTasks = Object.assign([], data)
            const getCurrentIndex = currentTasks.findIndex(r => r.key === newRecord.status);
            currentTasks[getCurrentIndex].tasks.push(newRecord)

            setData(currentTasks)
            resetStates()
        } catch (error) {
            console.log('ADDING ERROR', error)
        }
    }

    const updateInDB = async (id, status) => {
        try {
            const inst = await props.instance;
            // getCards();
            console.log('id', id, typeof id)
            const card = await inst.getCardById(id);
            console.log('card data', card);
            const newRecord = await inst.getCardById(id);
            console.log('newRecord', newRecord)
            const cardTobeUpdated = { ...newRecord, status }
            console.log('cardTobeUpdated', cardTobeUpdated)
            const updatedCard = await inst.updateCardById(newRecord.id, cardTobeUpdated)
            console.log('updatedCard', updatedCard);
        } catch (error) {
            console.log('error', error);
        }
    }

    const onDragEnd = async (result) => {
        if (!result.destination) return
        const { source, destination } = result

        if (source.droppableId !== destination.droppableId) {
            debugger
            const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
            const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)

            const sourceCol = data[sourceColIndex]
            const destinationCol = data[destinationColIndex]

            const sourceTask = [...sourceCol.tasks]
            const destinationTask = [...destinationCol.tasks]

            // const currentCard = sourceTask[source.index]

            // const removingCard = sourceTask[source.index]

            const [removed] = sourceTask.splice(source.index, 1)

            updateInDB(removed.id, destinationCol.key)

            destinationTask.splice(destination.index, 0, removed)

            data[sourceColIndex].tasks = sourceTask
            data[destinationColIndex].tasks = destinationTask
            setData(data)
        }
    }

    const handleNewTodoChange = (e) => {
        setNewTodo(e.target.value)
    }

    const handleSelectStatus = (e) => {
        setNewTodoStatus(e.target.value)
    }

    const handleDeleteTask = async (taskDetails, index) => {
        console.log('taskDetails', taskDetails)
        try {
            const inst = await props.instance;
            const deletedTask = await inst.deleteCardById(taskDetails.id);
            console.log('deletedTask', deletedTask)
            const currentTasks = Object.assign([], data)
            const taskIndexPos = taskStates[taskDetails.status]
            currentTasks[taskIndexPos].tasks.splice(index, 1)

            setData(currentTasks)
            // resetStates()
        } catch (error) {
            console.log('DELETING ERROR', error)
        }
    }

    return (
        <div className='container'>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban">
                    {
                        data.map(section => (
                            <Droppable
                                key={section.id}
                                droppableId={section.id}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        className='section'
                                        ref={provided.innerRef}
                                    >
                                        <div className="title">
                                            {section.title}
                                        </div>
                                        <div className="content">
                                            {
                                                section.tasks.map((task, index) => (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={task.id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    opacity: snapshot.isDragging ? '0.5' : '1'
                                                                }}
                                                            >
                                                                <Card >
                                                                    <div className='title'>{task.name}</div>
                                                                    <button className='delete' onClick={() => handleDeleteTask(task, index)}>Delete</button>
                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))
                    }
                </div>
            </DragDropContext>
            <div className='newTodoContainer'>
                <div className='newTodoForm'>
                    <div className='newTodo'>
                        <input className='input' type="text"
                            placeholder='eg: Bug: TextPoli not dispatching half stars'
                            value={newTodo} onChange={handleNewTodoChange} />
                        <div className='select'>
                            <label htmlFor="status">Status : </label>
                            <select name="status" id="status" onChange={handleSelectStatus} value={newTodoStatus}>
                                {Object.keys(taskStates).map(status => {
                                    return <option value={status}>{status}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <button className='button' onClick={addNewTask}>Add New</button>
                </div>
            </div>
        </div>
    )
}

export default Kanban