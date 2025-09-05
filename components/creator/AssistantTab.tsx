import React, { useState, useEffect, useRef } from 'react';
import { User, Creator, Author, Message, AITool } from '../../types';
import { AssistantIcon, MagicWandIcon, EditIcon, VideoCameraIcon, PhotoFilmIcon, SendIcon, SpinnerIcon } from '../../constants';
import * as grokService from '../../services/grokService';
import * as geminiService from '../../services/geminiService';
import * as huggingFaceService from '../../services/huggingFaceService';
import Button from '../ui/Button';

interface AssistantTabProps {
  user: User;
  justOnboarded: boolean;
}

const AssistantTab: React.FC<AssistantTabProps> = ({ user, justOnboarded }) => {
  const creator = user as Creator;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<AITool>(AITool.CHAT);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (justOnboarded) {
      setMessages([
        {
          id: 'welcome-1',
          author: Author.AI,
          content: (
            <div>
              <h3 className="font-bold text-lg">Welcome to your AI Assistant, {creator.creatorName}!</h3>
              <p className="mt-2 text-sm">I'm here to help you supercharge your creative process. Here's what I can do:</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li><strong>Generate Images:</strong> Create logos, thumbnails, and more from a text prompt.</li>
                <li><strong>Edit Images:</strong> Make changes to images I've just created.</li>
                <li><strong>Generate Videos:</strong> Create short video clips from a description.</li>
                <li><strong>Animate Photos:</strong> Turn a series of generated images into a video.</li>
              </ul>
              <p className="mt-3 text-sm">Try asking me to "create a logo for a synthwave gaming channel"!</p>
            </div>
          )
        }
      ]);
    }
  }, [justOnboarded, creator.creatorName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (author: Author, content: React.ReactNode, imageUrl?: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), author, content, imageUrl }]);
  };

  const updateLastMessage = (content: React.ReactNode, imageUrl?: string) => {
    setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length-1];
        if (lastMsg) {
            lastMsg.content = content;
            if (imageUrl) lastMsg.imageUrl = imageUrl;
        }
        return newMessages;
    });
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    addMessage(Author.USER, userMessage);
    setInput('');
    setIsLoading(true);

    const lastImageUrl = [...messages].reverse().find(m => m.imageUrl)?.imageUrl;
    const grokResponse = await grokService.processCommand(userMessage, activeTool, { lastImageUrl });
    
    switch (grokResponse.action) {
        case 'CHAT':
            addMessage(Author.AI, grokResponse.payload);
            break;
        case 'ENHANCE_PROMPT':
            addMessage(Author.AI, 
                <div>
                    <p className="font-semibold">Here's an enhanced prompt:</p>
                    <pre className="mt-2 p-2 bg-gray-800 rounded-md text-sm whitespace-pre-wrap font-mono">{grokResponse.payload}</pre>
                </div>
            );
            break;
        case 'GENERATE_IMAGE':
            addMessage(Author.AI, <div className="flex items-center gap-2"><SpinnerIcon className="w-4 h-4" /> Generating image...</div>);
            try {
                const url = await geminiService.generateImageAsset(grokResponse.payload);
                updateLastMessage(<img src={url} alt={grokResponse.payload} className="rounded-lg shadow-md max-w-sm" />, url);
            } catch (e) {
                updateLastMessage(<span className="text-amber-400">Primary service failed. Trying fallback...</span>);
                try {
                    const fallbackUrl = await huggingFaceService.generateImageAsset(grokResponse.payload);
                    updateLastMessage(<img src={fallbackUrl} alt={grokResponse.payload} className="rounded-lg shadow-md max-w-sm" />, fallbackUrl);
                } catch (fe) {
                    updateLastMessage(<span className="text-red-500">All image generation services failed.</span>);
                }
            }
            break;
        case 'EDIT_IMAGE':
            addMessage(Author.AI, <div className="flex items-center gap-2"><SpinnerIcon className="w-4 h-4" /> Editing image...</div>);
            const { prompt, imageUrl } = grokResponse.payload;
            const newUrl = await geminiService.editImageAsset(imageUrl, prompt);
            updateLastMessage(<img src={newUrl} alt={prompt} className="rounded-lg shadow-md max-w-sm" />, newUrl);
            break;
        case 'GENERATE_VIDEO':
            addMessage(Author.AI, <div className="flex items-center gap-2"><SpinnerIcon className="w-4 h-4" /> Generating video, this may take a moment...</div>);
            const videoUrl = await geminiService.generateVideo(grokResponse.payload);
            updateLastMessage(
                <video controls autoPlay muted loop className="rounded-lg shadow-md max-w-sm"><source src={videoUrl} type="video/mp4" /></video>
            );
            break;
        case 'GENERATE_VIDEO_FROM_IMAGES':
            const { count } = grokResponse.payload;
            const imageUrls = messages.filter(m => m.imageUrl).slice(-count).map(m => m.imageUrl!);
            if (imageUrls.length < count) {
                addMessage(Author.AI, <span className="text-red-500">Could not find {count} recent images to use. Please generate more first.</span>);
                break;
            }
            addMessage(Author.AI, <div className="flex items-center gap-2"><SpinnerIcon className="w-4 h-4" /> Animating {count} images into a video...</div>);
            const photoVideoUrl = await geminiService.generateVideoFromImages(imageUrls);
            updateLastMessage(
                <video controls autoPlay muted loop className="rounded-lg shadow-md max-w-sm"><source src={photoVideoUrl} type="video/mp4" /></video>
            );
            break;
        case 'ERROR':
            addMessage(Author.AI, <span className="text-red-500">{grokResponse.payload}</span>);
            break;
    }

    setIsLoading(false);
  };
  
  const aiTools = [
    { id: AITool.CHAT, Icon: AssistantIcon, label: 'Chat' },
    { id: AITool.PROMPT_ENHANCER, Icon: MagicWandIcon, label: 'Prompt Enhancer' },
    { id: AITool.IMAGE_EDITOR, Icon: EditIcon, label: 'Image Editor' },
    { id: AITool.VIDEO_GENERATION, Icon: VideoCameraIcon, label: 'Video Generation' },
    { id: AITool.PHOTO_TO_VIDEO, Icon: PhotoFilmIcon, label: 'Photo to Video' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">AI Assistant</h2>
      <p className="text-brand-text-dark mb-4">Your creative partner. Select a tool and give it a command.</p>

      {/* Tools Header */}
      <div className="relative mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-3 -mb-3 scrollbar-hide">
            {aiTools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                        activeTool === tool.id
                            ? 'bg-brand-primary text-white shadow-lg'
                            : 'bg-brand-surface hover:bg-gray-700'
                    }`}
                >
                    <tool.Icon className="w-4 h-4" />
                    {tool.label}
                </button>
            ))}
        </div>
        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-brand-bg/80 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.author === Author.USER ? 'justify-end' : ''}`}>
            {msg.author === Author.AI && <AssistantIcon className="w-8 h-8 rounded-full bg-brand-primary p-1.5 text-white flex-shrink-0" />}
            <div className={`p-3 rounded-lg max-w-xl text-sm ${msg.author === Author.AI ? 'bg-brand-surface' : 'bg-brand-accent text-white'}`}>
              {msg.content}
            </div>
            {msg.author === Author.USER && <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full flex-shrink-0" />}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Message your assistant in '${activeTool}' mode...`}
          className="flex-1 bg-brand-surface border border-gray-700/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} isLoading={isLoading} disabled={!input.trim()} className="h-[46px] w-[46px] p-0">
          <SendIcon className="w-5 h-5" />
        </Button>
      </div>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default AssistantTab;
