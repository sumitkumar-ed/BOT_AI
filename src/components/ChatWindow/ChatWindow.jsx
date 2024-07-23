import React, { useState, useEffect } from "react";
import staticData from "../../backend/staticData";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import StarRating from "../StarRating/StarRating"; // Import the StarRating component
import {
  addConversation,
  updateConversation,
  getConversations,
} from "../../backend/api";
import "./ChatWindow.css";
import BrandIcon from '../../assets/brand.svg';

const ChatWindow = ({ setConversations }) => {
  const [input, setInput] = useState("");
  const [localConversations, setLocalConversations] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [feedbackType, setFeedbackType] = useState("");
  const [typingResponse, setTypingResponse] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [ratingIndex, setRatingIndex] = useState(null); // Track which conversation is being rated

  useEffect(() => {
    const conversations = getConversations();
    setLocalConversations(conversations);
    setConversations(conversations);
  }, [setConversations]);

  useEffect(() => {
    if (currentIndex >= 0) {
      const response = localConversations[currentIndex]?.response || "";
      if (typingResponse.length < response.length) {
        const timer = setTimeout(() => {
          setTypingResponse(response.slice(0, typingResponse.length + 1));
        }, 50); // Adjust typing speed here
        return () => clearTimeout(timer);
      }
    }
  }, [typingResponse, currentIndex]);

  const handleAsk = () => {
    const response = staticData.find((item) =>
      item.question.toLowerCase().includes(input.toLowerCase())
    );
    const newConversation = {
      question: input,
      response: response?.response || "No response found",
      rating: 0,
      feedback: "",
    };
    addConversation(newConversation);
    const updatedConversations = getConversations();
    setLocalConversations(updatedConversations);
    setConversations(updatedConversations);
    setInput("");
    setTypingResponse("");
    setCurrentIndex(updatedConversations.length - 1); // Set the index to the last added conversation
    setRatingIndex(null); // Reset rating index
  };

  const handleFeedback = (index) => {
    setFeedbackTarget(index);
    setShowFeedbackModal(true);
  };

  const submitFeedback = (feedback) => {
    const conversations = getConversations();
    const updatedConversation = {
      ...conversations[feedbackTarget],
      feedback: feedback,
    };
    updateConversation(feedbackTarget, updatedConversation);
    const updatedConversations = getConversations();
    setLocalConversations(updatedConversations);
    setConversations(updatedConversations);
    setShowFeedbackModal(false);
  };

  const handleRating = (index, rating) => {
    const conversations = getConversations();
    const updatedConversation = { ...conversations[index], rating: rating };
    updateConversation(index, updatedConversation);
    const updatedConversations = getConversations();
    setLocalConversations(updatedConversations);
    setConversations(updatedConversations);
    setRatingIndex(null); // Hide star rating component after rating
  };

  return (
    <div className="chat-window">
    <img src={BrandIcon} alt="Brand" className="brand-icon-chat" />
      <div className="chat-body">
        {localConversations.map((conv, index) => (
          <div key={index} className="chat-response">
            <p>
              <strong>Q:</strong> {conv.question}
            </p>
            <p>
              <strong>A:</strong>{" "}
              {index === currentIndex ? typingResponse : conv.response}
            </p>
            <div className="feedback">
              <button onClick={() => setRatingIndex(index)}>
                Rate this response
              </button>
              <button onClick={() => handleFeedback(index)}>
                Provide feedback
              </button>
              {index === ratingIndex && (
                <StarRating
                  initialRating={conv.rating}
                  onRating={(rating) => handleRating(index, rating)}
                />
              )}
              {conv.rating > 0 ? (
                <div className="stars">
                  <StarRating initialRating={conv.rating} onRating={() => {}} />
                </div>
              ) : (
                <p></p>
              )}
              {conv.feedback && <p>Feedback: {conv.feedback}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
        />
        <button onClick={handleAsk}>Ask</button>
        <button>Save</button>
      </div>
      {showFeedbackModal && (
        <FeedbackModal
          onSubmit={submitFeedback}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
