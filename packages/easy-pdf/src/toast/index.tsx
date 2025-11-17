import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 1500, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <div className="easy-pdf-toast">{message}</div>;
};

// 创建一个工具函数来显示 toast
export const showToast = (message: string, duration = 1500) => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const removeToast = () => {
    root.unmount();
    document.body.removeChild(container);
  };

  root.render(
    <Toast message={message} duration={duration} onClose={removeToast} />
  );
};

export default Toast;
