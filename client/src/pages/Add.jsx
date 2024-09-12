// src/pages/Add.js
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Add = () => {
    const [book, setBook] = useState({
        title: '',
        desc: '',
        review: '',
        cover: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); 
            if (!token) {
                alert('You must be logged in to add a book.');
                navigate('/login');
                return;
            }

            await axios.post("http://localhost:8800/books", book, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            navigate('/books');
        } catch (err) {
            console.log(err);
            alert('Error adding book. Please try again.');
        }
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Add New Book</h1>
            <form className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Title" 
                    onChange={handleChange} 
                    name="title" 
                    value={book.title}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea 
                    placeholder="Description" 
                    onChange={handleChange} 
                    name="description" 
                    value={book.description}
                    className="w-full p-3 h-28 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea 
                    placeholder="Review" 
                    onChange={handleChange} 
                    name="review" 
                    value={book.review}
                    className="w-full p-3 h-28 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="text" 
                    placeholder="Cover (URL)" 
                    onChange={handleChange} 
                    name="cover" 
                    value={book.cover}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    onClick={handleClick}
                >
                    Add
                </button>

                <button 
                    className="w-full bg-red-400 text-white py-3 rounded-lg font-semibold hover:bg-red-500 transition-colors"
                    onClick={handleBackClick}
                >
                    Back
                </button>
            </form>
        </div>
    );
};

export default Add;
