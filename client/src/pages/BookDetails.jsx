import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BookDetails = () => {
    const { id } = useParams(); 
    const [book, setBook] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const token = localStorage.getItem('token'); 
                if (!token) {
                    alert('You must be logged in to view book details.');
                    navigate('/login'); 
                    return;
                }

                const res = await axios.get(`http://localhost:8800/books/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                setBook(res.data);
                setLoading(false); 
            } catch (err) {
                console.error(err);
                setError('Error fetching book details. Please try again.'); 
                setLoading(false); 
            }
        };

        fetchBookDetails();
    }, [id, navigate]);

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div className="text-red-600">{error}</div>; 
    }

    if (!book) {
        return <div>No book found.</div>; 
    }

    return (
        <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-8">
                {book.cover && 
                    <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="h-96 w-full object-cover mb-8 rounded"
                    />
                }
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{book.title}</h1>
                <p className="text-gray-600 mb-4"><b>Written by:</b> {book.username}</p>
                <p className="text-gray-700 mb-6">
                    <b>Description:</b> {book.description}
                </p>
                <p className="text-gray-700 mb-6">
                    <b>Review:</b> {book.review}
                </p>

                <div className="text-center mt-8">
                    <Link to="/books" className="bg-blue-500 text-white py-3 px-8 rounded-lg shadow hover:bg-blue-600 transition-colors">
                        Back to Books
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
