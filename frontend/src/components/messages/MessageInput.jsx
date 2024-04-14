import React, { useState } from "react";
import { BsSend, BsImage } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
//import upload from "../messages/upload";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const { loading, sendMessage } = useSendMessage();
  const [showImageInput, setShowImageInput] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setShowImageInput(false);
  };

  const handleSend = async () => {
    if (!message && !image) return;

    if (image) {
      const formData = new FormData();
      formData.append("photo", image);
      await sendMessage(formData);
    } else {
      await sendMessage(message);
    }

    setMessage("");
    setImage(null);
  };

  const handleToggleImageInput = () => {
    setShowImageInput(!showImageInput);
  };

  return (
    <form className="px-4 my-3" onSubmit={(e) => {e.preventDefault(); handleSend();}}>
      <div className="relative flex justify-between">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={showImageInput} // Disable text input when choosing image
        />
        <button type="button" onClick={handleToggleImageInput} className="flex items-center p-2 rounded-full text-black hover:text-black">
          <BsImage />
        </button>
        <input
          type="file"
          accept="image/*"
          className="absolute inset-y-0 opacity-0 w-full h-full cursor-pointer"
          onChange={handleImageChange}
          style={{ display: showImageInput ? 'block' : 'none' }}
        />
        <button type="submit" className="flex items-center p-2 rounded-full text-black hover:text-black">
          {loading ? <div className="loading loading-spinner"></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
