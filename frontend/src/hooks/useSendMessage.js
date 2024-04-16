import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message, images, senderId) => {
    const formData = new FormData();
    const blob = new Blob([images[0]], {
      type: "application/octet-stream",
    });
    formData.append("conversationId", selectedConversation._id);
    formData.append("senderId", '661650e6d69480875da38dec');
    formData.append("files", blob);
    formData.append("text", message);
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/send-message`, {
        method: "POST",
        body: formData,
      });
      const {data} = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, {senderId: '661650e6d69480875da38dec', text: data.text, createdAt: data.createdAt }]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
export default useSendMessage;
