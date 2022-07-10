import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import Card from '../Card/Card'
import { mockStructure, STATUS, mockTodoList } from '../../Data/mockData'
import './Kanban.scss'



const Kanban = (props) => {
    const [data, setData] = useState(mockStructure)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [formErrors, setFormErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [newTodoStatus, setNewTodoStatus] = useState('TODO')



    const getCards = async () => {
        try {
            const dbInstance = await props.instance;
            const cards = await dbInstance.getCards()
            const currentTasks = Object.assign([], data)
            cards.forEach(card => {
                const taskIndex = STATUS[card.status]
                currentTasks[taskIndex].tasks.push(card)
            });

            setData(currentTasks)
        } catch (error) {
            console.log('error', error)
        }
    }

    const createInitialTods = async () => {
        const dbInstance = await props.instance;
        mockTodoList.forEach(record => {
            dbInstance.addCard(record)
        })
    }

    React.useEffect(() => {
        // Initialize DB communications.
        createInitialTods()
        getCards();
    }, [])

    const resetStates = () => {
        setTitle('')
        setDescription('')
        setNewTodoStatus('TODO')
    }

    const addNewTask = async () => {
        try {
            let valid = true;
            const errors = Object.assign({})
            if (!title) {
                errors.title = 'Task name is Required'
                valid = false
            }
            if (!description) {
                errors.description = 'Task Description is Required'
                valid = false
            }

            if (valid) {
                setIsLoading(true)
                setFormErrors({})
                const dbInstance = await props.instance;
                const newId = await dbInstance.addCard({
                    name: title,
                    description: description,
                    status: newTodoStatus
                })

                const newTaskDetails = await dbInstance.getCardById(newId);
                const currentAllTasks = Object.assign([], data)
                const getCurrentTaskIndex = currentAllTasks.findIndex(r => r.key === newTaskDetails.status);
                currentAllTasks[getCurrentTaskIndex].tasks.push(newTaskDetails)

                setData(currentAllTasks)
                resetStates()
                setIsLoading(false)
            }
            else {
                setFormErrors(errors)
            }
        } catch (error) {
            console.log('ADDING ERROR', error)
            setIsLoading(false)
        }
    }

    const updateInDB = async (id, status) => {
        try {
            const dbInstance = await props.instance;
            const newTaskDetails = await dbInstance.getCardById(id);
            const taskToUpdate = { ...newTaskDetails, status }
            await dbInstance.updateCardById(newTaskDetails.id, taskToUpdate)
            return taskToUpdate;
        } catch (error) {
            console.log('updating Error', error);
            return null
        }
    }

    const onDragEnd = async (result) => {
        if (!result.destination) return
        const { source, destination } = result

        if (source.droppableId !== destination.droppableId) {
            setIsLoading(true)
            const clonedData = Object.assign([], data)
            const sourceColIndex = clonedData.findIndex(e => e.id === source.droppableId)
            const destinationColIndex = clonedData.findIndex(e => e.id === destination.droppableId)

            const sourceCol = clonedData[sourceColIndex]
            const destinationCol = clonedData[destinationColIndex]

            const sourceTask = [...sourceCol.tasks]
            const destinationTask = [...destinationCol.tasks]


            const [removed] = sourceTask.splice(source.index, 1)

            const updatedTask = await updateInDB(removed.id, destinationCol.key)

            destinationTask.splice(destination.index, 0, updatedTask)

            clonedData[sourceColIndex].tasks = sourceTask
            clonedData[destinationColIndex].tasks = destinationTask
            setData(clonedData)
            setIsLoading(false)
        }
    }

    const handleNewTitleTodoChange = (e) => {
        setTitle(e.target.value)
    }

    const handleNewTodoDescription = (e) => {
        setDescription(e.target.value)
    }

    const handleSelectStatus = (e) => {
        setNewTodoStatus(e.target.value)
    }

    const handleDeleteTask = async (taskDetails, index) => {
        try {
            const dbInstance = await props.instance;
            await dbInstance.deleteCardById(taskDetails.id);
            const currentAllTasks = Object.assign([], data)
            debugger;
            const taskIndexPosition = STATUS[taskDetails.status]
            currentAllTasks[taskIndexPosition].tasks.splice(index, 1)

            setData(currentAllTasks)
        } catch (error) {
            console.log('DELETING ERROR', error)
        }
    }

    return (
        <div className='container'>
            {
                isLoading && <div className='loader-container'>
                    <div className='loader'></div>
                </div>
            }


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
                                                                    <div className='title'>{task.name} : {task.description}</div>
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
                    <div className='form'>
                        <div className='inputElement'>
                            <input className='input title' type="text" name="title"
                                placeholder="Task name"
                                value={title} onChange={handleNewTitleTodoChange} />
                            {formErrors && formErrors['title'] && <p className='error'>{formErrors['title']}</p>}</div>
                        <div className='inputElement'><input className='input description' type="text" name="description"
                            placeholder="Task Description"
                            value={description} onChange={handleNewTodoDescription} />
                            {formErrors && formErrors['description'] && <p className='error'>{formErrors['description']}</p>}
                        </div>
                        <div className='select'>
                            <label htmlFor="status">Status : </label>
                            <select name="status" id="status" onChange={handleSelectStatus} value={newTodoStatus}>
                                {Object.keys(STATUS).map(status => {
                                    return <option value={status} key={status}>{status}</option>
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