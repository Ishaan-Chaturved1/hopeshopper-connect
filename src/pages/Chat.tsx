
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Paperclip, Smile } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const navigate = useNavigate();
  const { user, messages, sendMessage, suppliers, getConversations } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [attachment, setAttachment] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = getConversations();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() && !attachment) return;
    if (!selectedConversation) {
      toast({
        title: "Select a conversation",
        description: "Please select a supplier to chat with.",
        variant: "destructive"
      });
      return;
    }

    sendMessage(selectedConversation, messageText, attachment ? 'image' : 'text', attachment);
    setMessageText("");
    setAttachment("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentMessages = () => {
    if (!user || !selectedConversation) return [];
    
    return messages
      .filter(msg => 
        (msg.senderId === user.id && msg.receiverId === selectedConversation) ||
        (msg.senderId === selectedConversation && msg.receiverId === user.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || "Unknown Supplier";
  };

  const currentMessages = getCurrentMessages();
  const selectedSupplier = suppliers.find(s => s.id === selectedConversation);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chat</h1>
            <p className="opacity-90">Connect with your suppliers</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
          {/* Conversations List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.length > 0 ? conversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    onClick={() => setSelectedConversation(conversation.userId)}
                    className={`p-3 cursor-pointer hover:bg-muted transition-colors border-b ${
                      selectedConversation === conversation.userId ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-success flex items-center justify-center">
                        <span className="text-success-foreground font-bold text-sm">
                          {conversation.userName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{conversation.userName}</p>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-muted-foreground">
                    <p>No conversations yet</p>
                    <p className="text-sm mt-1">Start by contacting suppliers</p>
                    <Button 
                      size="sm" 
                      className="mt-3"
                      onClick={() => navigate("/suppliers")}
                    >
                      Browse Suppliers
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-3 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-success flex items-center justify-center">
                      <span className="text-success-foreground font-bold">
                        {selectedSupplier?.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedSupplier?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedSupplier?.phone}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.type === 'image' && message.attachment ? (
                            <div className="space-y-2">
                              <img 
                                src={message.attachment} 
                                alt="Attachment" 
                                className="max-w-full h-auto rounded"
                              />
                              {message.message && <p>{message.message}</p>}
                            </div>
                          ) : (
                            <p>{message.message}</p>
                          )}
                          <p className={`text-xs mt-1 ${
                            message.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    {attachment && (
                      <div className="mb-3 p-2 border rounded-lg bg-muted">
                        <div className="flex items-center justify-between">
                          <img src={attachment} alt="Preview" className="w-16 h-16 object-cover rounded" />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setAttachment("")}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Send className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                  <p>Choose a supplier from the left to start chatting</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
