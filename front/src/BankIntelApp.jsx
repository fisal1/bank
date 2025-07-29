import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './app.css';

const AttachmentModal = ({ showAttachmentModal, setShowAttachmentModal }) => {
  const [attachedFile, setAttachedFile] = useState(null);
  const [policyNumber, setPolicyNumber] = useState('');
  const [policyVersion, setPolicyVersion] = useState('');
  const [isUploading, setIsUploading] = useState(false); // NEW

  const handleAttachFile = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  const handleSubmitUpload = async () => {
    if (!attachedFile || !policyNumber || !policyVersion) {
      alert('Please select a file, enter policy number and version.');
      return;
    }

    const formData = new FormData();
    formData.append('file', attachedFile);
    formData.append('tag', policyNumber);
    formData.append('version', policyVersion);

    try {
      setIsUploading(true); // Start uploading
      await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Close modal and reset form first
      setAttachedFile(null);
      setPolicyNumber('');
      setPolicyVersion('');
      setShowAttachmentModal(false);

      // Then show success alert
      alert('Upload successful!');
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false); // Stop uploading
    }
  };

  if (!showAttachmentModal) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => !isUploading && setShowAttachmentModal(false)}
    >
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="upload-modal-header">
          <h4>Upload Document</h4>
          <button
            className="modal-close-btn"
            onClick={() => setShowAttachmentModal(false)}
            disabled={isUploading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="upload-form-container">
          <div className="upload-input-group">
            <label className="upload-label">Select Document</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="fileUpload"
                className="file-input-hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleAttachFile}
                disabled={isUploading}
              />
              <label htmlFor="fileUpload" className="file-browse-btn">
                <i className="fas fa-folder-open"></i>
                <span>{attachedFile ? attachedFile.name : 'Browse Files'}</span>
              </label>
            </div>
          </div>

          <div className="upload-input-group">
            <label className="upload-label">Policy Number</label>
            <input
              type="text"
              className="upload-input"
              placeholder="e.g. FX-OPS-004"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="upload-input-group">
            <label className="upload-label">Version</label>
            <input
              type="text"
              className="upload-input"
              placeholder="e.g. 3.1"
              value={policyVersion}
              onChange={(e) => setPolicyVersion(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <button
            className="attach-file-btn"
            onClick={handleSubmitUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span> Uploading...</span>
              </>
            ) : (
              <>
                <i className="fas fa-paperclip"></i>
                <span> Attach Document</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const BankIntelApp = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Function to ask backend
  const handleAsk = async (question) => {
    try {
      const res = await axios.post('http://localhost:8000/api/ask', { question });
      const { answer, sources } = res.data;

      const botMessage = {
        id: Date.now() + 1,
        text: answer,
        sources: sources || [],
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error asking question", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't get an answer from the server.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const sendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const question = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Call backend
    setTimeout(async () => {
      await handleAsk(question);
      setIsTyping(false);
    }, 500);
  }, [inputMessage]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      {currentScreen === 'welcome' ? (
        <div className="welcome-screen">
          <div className="welcome-container">
            <div className="bank-logo-large">
              <div className="logo-icon">
                <i className="fas fa-university"></i>
              </div>
              <h1 className="bank-title">Bank Intel</h1>
            </div>
            <div className="welcome-content">
              <h2>Your Internal Banking Assistant</h2>
              <p>Get instant access to banking policies, procedures, and internal documentation. Ask questions, upload documents, and streamline your workflow.</p>
              <button 
                className="get-started-btn" 
                onClick={() => setCurrentScreen('chat')}
              >
                Get Started
              </button>
              <div className="features-preview">
                <div className="feature">
                  <i className="fas fa-search"></i>
                  <span>Smart Search</span>
                </div>
                <div className="feature">
                  <i className="fas fa-upload"></i>
                  <span>Document Upload</span>
                </div>
                <div className="feature">
                  <i className="fas fa-comments"></i>
                  <span>Instant Answers</span>
                </div>
                <div className="feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-screen">
          <div className="chat-header">
            <button className="back-button" onClick={() => setCurrentScreen('welcome')}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="header-content">
              <div className="logo-small">
                <i className="fas fa-university"></i>
              </div>
              <h3>Bank Intel</h3>
            </div>
            <div className="status-indicator">
              <div className="online-dot"></div>
              <span>Online</span>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <div className="bot-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="message-content">
                  <p>Welcome to Bank Intel! I'm here to help you with banking policies, procedures, and documentation. Feel free to ask me anything or upload documents for analysis.</p>
                  <small className="message-time">Just now</small>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className={`${message.sender}-avatar`}>
                  <i className={message.sender === 'bot' ? 'fas fa-robot' : 'fas fa-user'}></i>
                </div>
                <div className="message-content">
                  <p>{message.text}</p>
                  {message.sources && message.sources.length > 0 && (
                    <small className="message-sources">
                      Sources: {message.sources.join(', ')}
                    </small>
                  )}
                  <small className="message-time">{message.timestamp}</small>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="bot-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <div className="chat-input">
              <button 
                className="attachment-btn" 
                onClick={() => setShowAttachmentModal(true)}
              >
                <i className="fas fa-plus"></i>
              </button>
              <input
                type="text"
                className="message-input"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="send-btn" onClick={sendMessage}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <AttachmentModal
        showAttachmentModal={showAttachmentModal}
        setShowAttachmentModal={setShowAttachmentModal}
      />
    </div>
  );
};

export default BankIntelApp;
