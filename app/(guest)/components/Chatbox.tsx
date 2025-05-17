"use client";
import React, { useEffect, useState, useRef } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { usePathname } from "next/navigation";

interface CozeConfig {
  bot_id: string;
}

interface CozeComponentProps {
  title: string;
}

interface CozeWebChatClientProps {
  config: CozeConfig;
  componentProps: CozeComponentProps;
}

declare global {
  interface Window {
    CozeWebSDK?: {
      WebChatClient: new (props: CozeWebChatClientProps) => void;
    };
  }
}

const CozeChat: React.FC = () => {
  const [isCozeLoaded, setIsCozeLoaded] = useState(false);

  const pathname = usePathname();

  const chatInstanceRef = useRef<
    null | (new (props: CozeWebChatClientProps) => void)
  >(null);

  // Function để clear chat widget
  const cleanupChatWidget = () => {
    // Xoá script
    const existingScript = document.querySelector('script[src*="coze"]');
    if (existingScript?.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }

    // Xoá chat widget
    const chatElements = document.querySelectorAll(
      '[class*="coze"], [id*="coze"]'
    );
    chatElements.forEach((element) => {
      if (element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    setIsCozeLoaded(false);
    chatInstanceRef.current = null;
  };

  useEffect(() => {
    // Dọn dẹp khi thay đổi nếu cần
    if (isCozeLoaded) {
      cleanupChatWidget();
      return;
    }

    // Không reload nếu đã load
    if (isCozeLoaded) {
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.0.0-beta.4/libs/oversea/index.js";
    script.async = true;

    script.onload = () => {
      if (window.CozeWebSDK && !chatInstanceRef.current) {
        chatInstanceRef.current = new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: "7482009377692762129",
          },
          componentProps: {
            title: "Tư vấn cùng Hady Agent",
          },
        });
        setIsCozeLoaded(true);
      }
    };

    document.body.appendChild(script);
  }, [pathname !== "/"]);

  useEffect(() => {}, [pathname !== "/"]);

  return null;
};

export default CozeChat;
