import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Bot, 
  User as UserIcon,
  Headphones,
  X,
  Clock,
  HelpCircle
} from 'lucide-react';

// Ticket categories - Basic Flow Step 2
const ticketCategories = [
  { id: 'technical', label: 'Technical Problem', icon: '🔧', color: 'bg-red-100 text-red-700' },
  { id: 'subscription', label: 'Subscription Information', icon: '💳', color: 'bg-blue-100 text-blue-700' },
  { id: 'system', label: 'System Errors', icon: '⚠️', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'billing', label: 'Billing Issues', icon: '💰', color: 'bg-green-100 text-green-700' },
  { id: 'classes', label: 'Classes & Scheduling', icon: '📅', color: 'bg-purple-100 text-purple-700' },
  { id: 'other', label: 'Other Questions', icon: '❓', color: 'bg-gray-100 text-gray-700' },
];

// AI Responses simulation
const getAIResponse = (message: string, category: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Category-specific responses
  if (category === 'subscription') {
    if (lowerMessage.includes('cancel') || lowerMessage.includes('terminate')) {
      return "I understand you're asking about canceling your subscription. You can cancel your membership anytime from the Membership tab. Would you like me to guide you through the cancellation process, or would you prefer to speak with our team?";
    }
    if (lowerMessage.includes('upgrade') || lowerMessage.includes('change plan')) {
      return "Great question! You can upgrade your membership plan anytime. We offer Basic ($49.99/mo), Premium ($99.99/mo), and Elite ($149.99/mo) plans. Each tier includes additional benefits. Would you like to see a detailed comparison?";
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our membership pricing is: Basic ($49.99/mo), Premium ($99.99/mo), and Elite ($149.99/mo). All plans include gym access, with Premium and Elite adding group classes and personal training sessions. What would you like to know more about?";
    }
  }
  
  if (category === 'technical') {
    if (lowerMessage.includes('login') || lowerMessage.includes('password')) {
      return "If you're having trouble logging in, try resetting your password using the 'Forgot Password' link on the login page. If the issue persists, I can escalate this to our technical team. Have you tried resetting your password?";
    }
    if (lowerMessage.includes('app') || lowerMessage.includes('mobile')) {
      return "For app-related issues, please ensure you have the latest version installed. You can update from the App Store or Google Play. If problems continue, try clearing the app cache or reinstalling. Is this helping?";
    }
  }
  
  if (category === 'classes') {
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve')) {
      return "You can book classes from the 'Book Classes' tab in your dashboard. Select a class, view details, and click 'Book Now'. If a class is full, you can join the waitlist. Do you need help booking a specific class?";
    }
    if (lowerMessage.includes('cancel') && lowerMessage.includes('class')) {
      return "You can cancel your class booking up to 2 hours before the class starts. Go to 'My Schedule' and click 'Cancel' next to your booking. Late cancellations may incur a fee. Would you like more details?";
    }
  }
  
  // Generic helpful responses
  const genericResponses = [
    "Thank you for your question! I'm here to help. Could you provide a bit more detail about your issue so I can assist you better?",
    "I understand your concern. Let me help you with that. Can you tell me more about what you're experiencing?",
    "Great question! To provide you with the most accurate information, could you share more details about your specific situation?",
    "I'm happy to assist! Based on your question, I'd recommend checking our FAQ section, but I can also provide personalized help. What would you prefer?",
  ];
  
  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
};

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'support';
  text: string;
  timestamp: Date;
}

interface Ticket {
  id: string;
  category: string;
  status: 'open' | 'closed';
  createdAt: Date;
  messages: Message[];
}

export function CustomerSupport() {
  const [showSupport, setShowSupport] = useState(false);
  const [step, setStep] = useState<'category' | 'initial' | 'chat'>('category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isEscalated, setIsEscalated] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Basic Flow Step 3: Select category
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('initial');
  };

  // Basic Flow Steps 5-7: Submit initial message and create ticket
  const handleSubmitInitialMessage = () => {
    if (!initialMessage.trim()) return;

    // Simulate 10% chance of system error - Alternative Flow 2
    const hasError = Math.random() < 0.1;
    
    if (hasError) {
      setShowError(true);
      console.log('Error notification sent to secretary');
      console.log('Email notification sent to user');
      return;
    }

    // Create ticket with unique ID
    const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
    const newTicket: Ticket = {
      id: ticketId,
      category: selectedCategory,
      status: 'open',
      createdAt: new Date(),
      messages: [
        {
          id: '1',
          sender: 'user',
          text: initialMessage,
          timestamp: new Date()
        }
      ]
    };

    setCurrentTicket(newTicket);
    setShowConfirmation(true);
    
    console.log('Ticket created:', ticketId);

    // Auto-proceed to chat after confirmation
    setTimeout(() => {
      setShowConfirmation(false);
      setStep('chat');
      
      // Basic Flow Step 8: AI analyzes and responds
      setTimeout(() => {
        handleAIResponse(initialMessage);
      }, 1000);
    }, 2000);
  };

  // Basic Flow Step 8: AI response
  const handleAIResponse = (userMessage: string) => {
    if (!currentTicket) return;

    setIsTyping(true);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: isEscalated ? 'support' : 'ai',
        text: isEscalated 
          ? "Hello! I'm Sarah from the gym support team. I've reviewed your conversation with our AI assistant. How can I help you further?"
          : getAIResponse(userMessage, selectedCategory),
        timestamp: new Date()
      };

      setCurrentTicket({
        ...currentTicket,
        messages: [...currentTicket.messages, aiMessage]
      });
      
      setIsTyping(false);
    }, 1500);
  };

  // Send message in chat
  const handleSendMessage = () => {
    if (!chatInput.trim() || !currentTicket) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setCurrentTicket({
      ...currentTicket,
      messages: [...currentTicket.messages, newMessage]
    });

    const newCount = messageCount + 1;
    setMessageCount(newCount);

    // Alternative Flow 1: Show escalation option after 5 messages
    if (newCount >= 5 && !isEscalated) {
      setShowEscalation(true);
    }

    setChatInput('');

    // Get AI response
    setTimeout(() => {
      handleAIResponse(chatInput);
    }, 500);
  };

  // Alternative Flow 1: Escalate to human support
  const handleEscalateToHuman = () => {
    setShowEscalation(false);
    setIsEscalated(true);
    
    console.log('Ticket escalated to gym secretary');
    console.log('Secretary notification sent');

    if (currentTicket) {
      const escalationMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: "I'm connecting you with a member of our support team. They'll be with you shortly to provide personalized assistance.",
        timestamp: new Date()
      };

      setCurrentTicket({
        ...currentTicket,
        messages: [...currentTicket.messages, escalationMessage]
      });

      // Simulate secretary joining
      setTimeout(() => {
        handleAIResponse('');
      }, 2000);
    }
  };

  // Basic Flow Step 9-10: Close conversation
  const handleCloseTicket = () => {
    if (!currentTicket) return;

    setCurrentTicket({
      ...currentTicket,
      status: 'closed'
    });

    console.log('Ticket closed:', currentTicket.id);

    // Reset
    setTimeout(() => {
      setShowSupport(false);
      setStep('category');
      setSelectedCategory('');
      setInitialMessage('');
      setCurrentTicket(null);
      setChatInput('');
      setMessageCount(0);
      setIsEscalated(false);
    }, 2000);
  };

  // Alternative Flow 2: Handle error and retry
  const handleRetryAfterError = () => {
    setShowError(false);
    setInitialMessage('');
  };

  // Alternative Flow 2: Secretary resolves the issue
  const handleSecretaryResolve = () => {
    if (!currentTicket) return;

    const resolutionMessage: Message = {
      id: Date.now().toString(),
      sender: 'support',
      text: "I've resolved your issue! Your account has been updated and everything should be working correctly now. Is there anything else I can help you with?",
      timestamp: new Date()
    };

    setCurrentTicket({
      ...currentTicket,
      messages: [...currentTicket.messages, resolutionMessage]
    });
  };

  return (
    <>
      {/* Support Button - Floating Action */}
      <button
        onClick={() => setShowSupport(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-40"
        title="Customer Support"
      >
        <Headphones className="size-6" />
      </button>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageSquare className="size-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Customer Support & Queries</CardTitle>
                  {currentTicket && (
                    <p className="text-sm text-gray-500 font-normal mt-1">
                      Ticket #{currentTicket.id} • {currentTicket.status === 'closed' ? '✓ Closed' : '🔵 Active'}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowSupport(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>

            {/* Basic Flow Step 2: Category Selection */}
            {step === 'category' && (
              <CardContent className="pt-6 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-2">How can we help you today?</h3>
                  <p className="text-sm text-gray-500">
                    Select a category that best describes your issue
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ticketCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="p-4 border-2 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full text-2xl ${category.color} group-hover:scale-110 transition-transform`}>
                          {category.icon}
                        </div>
                        <div className="font-medium">{category.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            )}

            {/* Basic Flow Steps 4-6: Initial Message Input */}
            {step === 'initial' && (
              <CardContent className="pt-6 overflow-y-auto">
                <div className="mb-6">
                  <Badge className={ticketCategories.find(c => c.id === selectedCategory)?.color}>
                    {ticketCategories.find(c => c.id === selectedCategory)?.label}
                  </Badge>
                  <h3 className="font-medium text-lg mt-4 mb-2">Describe your issue</h3>
                  <p className="text-sm text-gray-500">
                    Please provide as much detail as possible so we can assist you better
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Your Question or Problem</Label>
                    <Textarea
                      placeholder="Type your question here..."
                      rows={6}
                      value={initialMessage}
                      onChange={(e) => setInitialMessage(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setStep('category');
                        setSelectedCategory('');
                        setInitialMessage('');
                      }}
                    >
                      Back
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleSubmitInitialMessage}
                      disabled={!initialMessage.trim()}
                    >
                      <Send className="size-4 mr-2" />
                      Submit Question
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}

            {/* Basic Flow Step 8-9: Chat Interface */}
            {step === 'chat' && currentTicket && (
              <>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
                  {currentTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`p-2 rounded-full ${
                        message.sender === 'user' 
                          ? 'bg-blue-100' 
                          : message.sender === 'support'
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      } shrink-0`}>
                        {message.sender === 'user' ? (
                          <UserIcon className="size-5 text-blue-600" />
                        ) : message.sender === 'support' ? (
                          <Headphones className="size-5 text-green-600" />
                        ) : (
                          <Bot className="size-5 text-gray-600" />
                        )}
                      </div>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-gray-100 shrink-0">
                        <Bot className="size-5 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="size-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="size-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="size-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Chat Input */}
                {currentTicket.status === 'open' && (
                  <div className="border-t p-4 space-y-3">
                    {isEscalated && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-sm">
                        <Headphones className="size-4 text-green-600" />
                        <span className="text-green-700">Connected with support team</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} disabled={!chatInput.trim()}>
                        <Send className="size-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      {!isEscalated && messageCount >= 5 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowEscalation(true)}
                          className="flex-1"
                        >
                          <Headphones className="size-4 mr-2" />
                          Talk to Support Team
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCloseTicket}
                        className={!isEscalated && messageCount >= 5 ? 'flex-1' : 'w-full'}
                      >
                        <CheckCircle className="size-4 mr-2" />
                        Close Ticket
                      </Button>
                    </div>
                  </div>
                )}

                {/* Ticket Closed */}
                {currentTicket.status === 'closed' && (
                  <div className="border-t p-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="size-12 text-green-600 mx-auto mb-2" />
                      <div className="font-medium text-green-900">Ticket Closed</div>
                      <div className="text-sm text-green-700 mt-1">
                        Thank you for contacting support!
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      )}

      {/* Basic Flow Step 7: Ticket Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="size-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Question Submitted Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Your question has been successfully submitted.
              </p>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <div className="text-sm text-gray-600 mb-1">Your Ticket ID</div>
                <div className="text-2xl font-medium text-blue-600">{currentTicket?.id}</div>
              </div>
              <p className="text-sm text-gray-500">
                Our AI assistant is analyzing your question and will respond shortly...
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alternative Flow 2: Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-red-100 rounded-full">
                  <AlertCircle className="size-12 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">System Error</h3>
              <p className="text-gray-600 mb-4">
                Error processing the question. Please try again later.
              </p>
              <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>What happens next:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>You'll receive an email notification about this issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Our technical team has been notified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>A support representative will contact you shortly</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowError(false);
                    setShowSupport(false);
                    setStep('category');
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  onClick={handleRetryAfterError}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alternative Flow 1: Escalation Modal */}
      {showEscalation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="size-6 text-blue-600" />
                Talk to Support Team?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Would you like to connect with a member of our support team for personalized assistance?
              </p>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Clock className="size-4" />
                  <span>Average response time: 2-5 minutes</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowEscalation(false)}
                >
                  Continue with AI
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleEscalateToHuman}
                >
                  Talk to Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
