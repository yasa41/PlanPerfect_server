import ToDoList from "../models/toDoListModel.js";

// Get ToDo list for an event
export const getToDoListByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const toDoList = await ToDoList.findOne({ eventId });
    if (!toDoList) return res.json({ success: true, tasks: [] }); // empty list if none found
    res.json({ success: true, tasks: toDoList.tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new task to ToDo list
export const addTask = async (req, res) => {
  try {
    const { eventId, description } = req.body;

    let toDoList = await ToDoList.findOne({ eventId });
    if (!toDoList) {
      toDoList = new ToDoList({ eventId, tasks: [] });
    }

    toDoList.tasks.push({ description, status: 'pending' });
    await toDoList.save();

    res.json({ success: true, tasks: toDoList.tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete task by task id from ToDo list
export const deleteTask = async (req, res) => {
  try {
    const { eventId, taskId } = req.body;

    const toDoList = await ToDoList.findOne({ eventId });
    if (!toDoList)
      return res.status(404).json({ success: false, message: 'ToDo list not found' });

    // Filter out the task with that ID
    const originalLength = toDoList.tasks.length;
    toDoList.tasks = toDoList.tasks.filter(task => task._id.toString() !== taskId);

    // If no task was removed (task not found)
    if (toDoList.tasks.length === originalLength) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await toDoList.save();

    return res.json({ success: true, tasks: toDoList.tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Update status or description of task
export const updateTask = async (req, res) => {
  try {
    const { eventId, taskId, status, description } = req.body;

    const toDoList = await ToDoList.findOne({ eventId });
    if (!toDoList) return res.status(404).json({ success: false, message: 'ToDo list not found' });

    const task = toDoList.tasks.id(taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (status) task.status = status;
    if (description) task.description = description;

    await toDoList.save();
    res.json({ success: true, tasks: toDoList.tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
