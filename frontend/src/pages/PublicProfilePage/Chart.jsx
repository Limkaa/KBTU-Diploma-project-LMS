import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RatingChart = ({ students, currentStudent }) => {
    const getColorForStudent = (studentName) => {
        if (studentName === currentStudent) {
            return 'rgb(234, 90, 12)'; // Красный цвет для студента 3
        }
        return '#163a61'; // Основной цвет для остальных студентов
    };

    const dataWithColors = students.map((student) => ({
        ...student,
        fill: getColorForStudent(student.name),
    }));

    return (
        <BarChart width={450} height={200} data={dataWithColors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="rating" fill="#8884d8" />
        </BarChart>
    );
};

export default RatingChart;
