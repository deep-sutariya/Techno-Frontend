import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const LocationCard = ({ location, confirmShow, fetchLocation }) => {
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormId, setEditFormId] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskIdToEdit, setTaskIdToEdit] = useState(null);

    const tasks = location.tasks || [];

    const handleAddTask = async () => {
        if (taskTitle.length == 0) {
            setShowForm(false);
            return;
        }

        try {
            const task = { title: taskTitle };
            const response = await axios.post(`${process.env['API_BASE_URL']}/addtask`, { id: location._id, task });
            // console.log(response?.data);
            setTaskTitle('');
            setShowForm(false);
            fetchLocation()
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleEditTask = async () => {
        try {
            const task = { title: taskTitle.trim() };
            console.log(task);
            const response = await axios.post(`${process.env['API_BASE_URL']}/updatetask`, { id: location._id, taskId: taskIdToEdit, updatedTask: task });
            // console.log(response?.data);
            setTaskTitle('');
            setShowForm(false);
            setShowEditForm(false);
            setEditFormId(null)
            fetchLocation()
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await axios.post(`${process.env['API_BASE_URL']}/deletetask`, { id: location._id, taskId });
            // console.log(response?.data);
            setTaskTitle('');
            setShowForm(false);
            fetchLocation()
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <View className="bg-gray-100 rounded-lg p-4 m-3 max-w-[90%]">
            <View className="flex-row items-start">
            <View className="flex-col w-[90%]">
                <Text className="font-bold text-sm mb-2 text-justify">{location.address}</Text>
                <Text className="text-gray-600 mb-4">{location.locality}, {location.region}, {location.country}</Text>
            </View>
            <TouchableOpacity className=" ml-auto" onPress={() => confirmShow(location._id)}><AntDesign name="close" size={20} color="#64748B" /></TouchableOpacity>
            </View>

            {tasks.map(task => (
                <View key={task._id} className="flex-row items-center justify-between bg-gray-200 p-2 rounded-md mb-2">
                    <View className="py-1 flex-row justify-between">
                        {
                            showEditForm && editFormId==task._id?
                                <View className="rounded-lg flex-row justify-between items-center mx-auto w-full">
                                    <TextInput
                                        value={taskTitle}
                                        onChangeText={setTaskTitle}
                                        placeholder="Task Title"
                                        className=" flex-[0.95] border rounded-lg outline-none py-1 px-2 border-slate-500"
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleEditTask(task._id)}
                                        className="bg-hover text-white font-semibold rounded-md py-2 px-3">
                                        <AntDesign name="check" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                                :
                                <Text className="font-semibold flex-[0.98]">{task.title}</Text>
                        }
                        {
                            !showEditForm || editFormId!=task._id ?
                                <View className="flex-row items-center">
                                    <TouchableOpacity onPress={() => { setTaskIdToEdit(task._id); setTaskTitle(task.title); setShowEditForm(true); setEditFormId(task._id) }} className="mr-2">
                                        <FontAwesome6 name="edit" size={16} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteTask(task._id)}>
                                        <AntDesign name="delete" size={16} color="#FF474C" />
                                    </TouchableOpacity>
                                </View>
                                : <></>
                        }
                    </View>
                </View>
            ))}

            <View className="min-w-full flex-row items-center mx-auto">
                {
                    showForm ?
                        <View className="rounded-lg py-1 px-1 flex-row justify-between items-center mx-auto w-full">
                            <TextInput
                                value={taskTitle}
                                onChangeText={setTaskTitle}
                                placeholder="Task Title"
                                className=" flex-[0.95] border rounded-lg outline-none py-1 px-2 border-slate-500"
                            />
                            <TouchableOpacity
                                onPress={handleAddTask}
                                className="bg-hover text-white font-semibold rounded-md py-2 px-3">
                                <AntDesign name="check" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity onPress={() => setShowForm(true)} className="bg-hover text-white font-semibold rounded-md py-2 px-3 ">
                            <FontAwesome6 name="add" size={16} color="white" />
                        </TouchableOpacity>
                }

            </View>

        </View>
    );
};

export default LocationCard;
