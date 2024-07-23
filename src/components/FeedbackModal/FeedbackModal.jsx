import React, { useState } from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ onSubmit, onClose }) => {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        onSubmit(feedback);
        setFeedback('');
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Provide Feedback</h2>
                <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback"
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default FeedbackModal;