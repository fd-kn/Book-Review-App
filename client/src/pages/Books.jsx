import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Books = () => {
    const [books, setBooks] = useState([]);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from localStorage
                if (!token) {
                    alert('You must be logged in to view books.');
                    navigate('/login');
                    return;
                }

                // Fetch user info
                const userRes = await axios.get("http://localhost:8800/user", {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include token in the headers
                    }
                });
                setUsername(userRes.data.username);

                // Fetch books
                const booksRes = await axios.get("http://localhost:8800/books", {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include token in the headers
                    }
                });
                setBooks(booksRes.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserInfo();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token from localStorage
        navigate('/'); // Redirect to login page
    };

    const handleDelete = async (bookId) => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            if (!token) {
                alert('You must be logged in to delete a book.');
                navigate('/login');
                return;
            }

            // Send DELETE request to remove the book
            await axios.delete(`http://localhost:8800/books/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include token in the headers
                }
            });

            // Remove the deleted book from state
            setBooks(books.filter(book => book.id !== bookId));
        } catch (err) {
            console.log(err);
            alert('Error deleting book. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-5xl font-bold text-blue-600 tracking-wide">Book Reviews</h1>
                <div className="flex items-center space-x-6">
                    {username && (
                        <span className="text-lg font-medium text-gray-700">
                            Welcome, <span className="font-semibold text-blue-500">{username}</span>
                        </span>
                    )}
                    <button 
                        className="bg-red-500 text-white py-2 px-6 rounded-lg shadow hover:bg-red-600 transition-colors"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                </div>
            </header>

            <div className="text-center mt-12">
                <button className="bg-green-500 text-white py-3 px-8 rounded-lg shadow hover:bg-green-600 transition-colors">
                    <Link to='/add' className="text-white">Add New Book</Link>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {books.map((book) => (
                    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 p-6" key={book.id}>
                        {book.cover && 
                            <img 
                                src={book.cover} 
                                alt={book.title} 
                                className="h-64 w-full object-cover mb-4 rounded"
                            />
                        }
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
                        <p className="text-gray-600 mb-4">Written by: {book.username}</p> {/* Username added here */}
                        <div className="flex justify-between">
                            <button 
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Link to={`/book/${book.id}`} className="text-white">View</Link>
                            </button>
                            <div className="flex space-x-2">
                                <button 
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <Link to={`/update/${book.id}`} className="text-white">Update</Link>
                                </button>
                                <button 
                                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                    onClick={() => handleDelete(book.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

 
        </div>
    );
}

export default Books;
