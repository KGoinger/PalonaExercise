"use client";

import dynamic from "next/dynamic";

const ChatView = dynamic(() => import("../../components/chat-view"), {
  ssr: false,
});

export default function ChatPage() {
  return <ChatView />;
}
