import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Update = () => {
    const [book, setBook] = useState({
        title: '',
        description: '', 
        review: '',
        cover: '',
    });

    const [booksInfo, setBooksInfo] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const bookId = location.pathname.split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = localStorage.getItem('token'); 
                if (!token) {
                    alert('You must be logged in to update a book.');
                    navigate('/login');
                    return;
                }

                const res = await axios.get("http://localhost:8800/books", {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                setBooksInfo(res.data);

                const filteredBooks = res.data.filter(b => b.id === parseInt(bookId));
                if (filteredBooks.length > 0) {
                    setBook(filteredBooks[0]);
                } else {
                    console.log("No book found with the given ID.");
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchBook();
    }, [bookId, navigate]);

    const handleChange = (e) => {
        setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); 
            if (!token) {
                alert('You must be logged in to update a book.');
                navigate('/login');
                return;
            }

            await axios.put(`http://localhost:8800/books/${bookId}`, book, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            navigate('/books');
        } catch (err) {
            console.log(err);
        }
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Update Book</h1>
            <form className="space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={book.title}
                    onChange={handleChange}
                    name="title"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    placeholder="Description"
                    value={book.description}
                    onChange={handleChange}
                    name="description" 
                    className="w-full p-3 h-28 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    placeholder="Review"
                    value={book.review}
                    onChange={handleChange}
                    name="review"
                    className="w-full p-3 h-28 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Cover (URL)"
                    value={book.cover}
                    onChange={handleChange}
                    name="cover"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    onClick={handleClick}
                >
                    Update
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

export default Update;
