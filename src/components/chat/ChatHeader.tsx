import { Conversation } from "model/conversation";
import React from "react";

interface ChatHeaderProps {
    conversation: Conversation;
};

export default function ChatHeader(props: ChatHeaderProps): JSX.Element {
    
    return (
        <div className="inset-0 pb-3 pt-1 my-0 flex items-start justify-between px-4 sm:px-2 shadow-sm z-10">
            <div className='flex pl-1'>
                <h2 className="text">{props?.conversation?.targetLang} Coach</h2>
            </div>
        </div>
    );
};
