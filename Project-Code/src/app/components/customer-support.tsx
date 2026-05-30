import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Bot,
  User as UserIcon,
  Clock,
  Ticket,
  AlertTriangle,
  UserCog
} from 'lucide-react';
import { MockDatabase, SupportTicket } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function CustomerSupport() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Create ticket form
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Chat state
  const [messageInput, setMessageInput] = useState('');
  const [showEscalateOption, setShowEscalateOption] = useState(false);
  const [aiError, setAiError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadMyTickets();
    }
  }, [user]);

  useEffect(() => {
    if (isChatModalOpen && selectedTicket) {
      scrollToBottom();
      checkEscalateOption();
    }
  }, [isChatModalOpen, selectedTicket]);

  const loadMyTickets = () => {
    if (!user) return;
    const tickets = db.getSupportTicketsByUser(user.id);
    setMyTickets(tickets);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkEscalateOption = () => {
    if (!selectedTicket) return;

    // Show escalate option after 5 messages
    const memberMessages = selectedTicket.messages.filter(m => m.senderType === 'member');
    setShowEscalateOption(memberMessages.length >= 5 && selectedTicket.status !== 'Escalated' && selectedTicket.status !== 'Closed');
  };

  const handleCreateTicket = () => {
    if (!user || !category || !subject.trim() || !description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newTicket = db.createSupportTicket({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      category: category as any,
      subject: subject.trim(),
      description: description.trim(),
      priority: 'Medium',
    });

    // Send initial AI response
    try {
      const aiResponse = db.generateAIResponse(description, category);

      db.addMessageToTicket(newTicket.id, {
        senderId: 'ai',
        senderName: 'FitHub AI Assistant',
        senderType: 'ai',
        message: aiResponse,
      });
    } catch (error) {
      // AI error occurred
      db.updateSupportTicket(newTicket.id, {
        aiErrorOccurred: true,
      });

      // Notify secretary
      const secretary = db.getAllUsers().find(u => u.role === 'secretary');
      if (secretary) {
        db.sendEmail({
          to: secretary.email,
          subject: 'AI System Error - Support Ticket Needs Attention',
          body: `AI system failed to respond to ticket ${newTicket.ticketNumber}.\n\nMember: ${user.name}\nCategory: ${category}\nSubject: ${subject}\n\nPlease respond to the member manually.`,
        });
      }

      // Notify user
      db.sendEmail({
        to: user.email,
        subject: 'Support Request Received',
        body: `Hi ${user.name},\n\nWe've received your support request (Ticket #${newTicket.ticketNumber}).\n\nDue to a technical issue, our AI assistant is currently unavailable. A member of our support team will respond to you shortly.\n\nThank you for your patience!\n\nBest regards,\nFitHub Team`,
      });
    }

    // Reset form
    setCategory('');
    setSubject('');
    setDescription('');
    setIsCreateModalOpen(false);

    // Reload tickets
    loadMyTickets();

    // Open chat with new ticket
    const refreshedTicket = db.getSupportTicketById(newTicket.id);
    if (refreshedTicket) {
      setSelectedTicket(refreshedTicket);
      setIsChatModalOpen(true);
    }
  };

  const handleSendMessage = () => {
    if (!selectedTicket || !user || !messageInput.trim()) return;

    // Add member message
    db.addMessageToTicket(selectedTicket.id, {
      senderId: user.id,
      senderName: user.name,
      senderType: 'member',
      message: messageInput.trim(),
    });

    const currentMessage = messageInput.trim();
    setMessageInput('');

    // If ticket is escalated, secretary will respond manually
    if (selectedTicket.status === 'Escalated') {
      const refreshed = db.getSupportTicketById(selectedTicket.id);
      if (refreshed) {
        setSelectedTicket(refreshed);
        scrollToBottom();
      }
      return;
    }

    // Generate AI response if ticket is not escalated
    try {
      setAiError(false);
      const aiResponse = db.generateAIResponse(currentMessage, selectedTicket.category);

      setTimeout(() => {
        db.addMessageToTicket(selectedTicket.id, {
          senderId: 'ai',
          senderName: 'FitHub AI Assistant',
          senderType: 'ai',
          message: aiResponse,
        });

        const refreshed = db.getSupportTicketById(selectedTicket.id);
        if (refreshed) {
          setSelectedTicket(refreshed);
          checkEscalateOption();
          scrollToBottom();
        }
      }, 1000);
    } catch (error) {
      // AI error - notify user and secretary
      setAiError(true);

      db.updateSupportTicket(selectedTicket.id, {
        aiErrorOccurred: true,
      });

      db.sendEmail({
        to: user.email,
        subject: 'Support System Issue',
        body: `Hi ${user.name},\n\nWe're experiencing a technical issue with our support system for ticket ${selectedTicket.ticketNumber}.\n\nA member of our support team has been notified and will respond to you shortly.\n\nWe apologize for the inconvenience!\n\nBest regards,\nFitHub Team`,
      });

      const secretary = db.getAllUsers().find(u => u.role === 'secretary');
      if (secretary) {
        db.sendEmail({
          to: secretary.email,
          subject: 'AI System Error - Support Ticket Needs Attention',
          body: `AI system failed for ticket ${selectedTicket.ticketNumber}.\n\nMember: ${user.name}\nCategory: ${selectedTicket.category}\n\nPlease respond manually.`,
        });
      }
    }
  };

  const handleEscalate = () => {
    if (!selectedTicket) return;

    const secretary = db.getAllUsers().find(u => u.role === 'secretary');
    if (!secretary) {
      alert('No secretary available for escalation');
      return;
    }

    db.escalateTicketToSecretary(selectedTicket.id, secretary.id, secretary.name);

    const refreshed = db.getSupportTicketById(selectedTicket.id);
    if (refreshed) {
      setSelectedTicket(refreshed);
      setShowEscalateOption(false);
    }

    alert('Your ticket has been escalated to our support team. A representative will respond shortly.');
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;

    db.closeTicket(selectedTicket.id, 'member');
    setIsChatModalOpen(false);
    loadMyTickets();
  };

  const handleOpenChat = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsChatModalOpen(true);
    setAiError(ticket.aiErrorOccurred || false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case 'AI Responding':
        return <Badge className="bg-purple-100 text-purple-800">AI Responding</Badge>;
      case 'Escalated':
        return <Badge className="bg-yellow-100 text-yellow-800">Escalated</Badge>;
      case 'Closed':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'Low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-5" />
                Customer Support
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Get help with any questions or issues</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <MessageSquare className="size-4 mr-2" />
              New Support Request
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* My Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>My Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {myTickets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Ticket className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No support tickets yet.</p>
              <p className="text-sm">Create a new ticket if you need assistance!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleOpenChat(ticket)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">#{ticket.ticketNumber}</span>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">Category: {ticket.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <span>{ticket.messages.length} messages</span>
                    {ticket.assignedToName && (
                      <span className="flex items-center gap-1">
                        <UserCog className="size-3" />
                        Assigned to {ticket.assignedToName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Ticket Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Support Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical Problem">Technical Problem</SelectItem>
                  <SelectItem value="Subscription Info">Subscription Info</SelectItem>
                  <SelectItem value="System Errors">System Errors</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Classes & Programs">Classes & Programs</SelectItem>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Subject</Label>
              <Input
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Please provide details about your question or issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="mt-2"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <Bot className="size-4 inline mr-1" />
                Our AI assistant will respond to your request immediately. If needed, your ticket can be escalated to our support team.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket}>
              <Send className="size-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Ticket #{selectedTicket?.ticketNumber}</DialogTitle>
                <p className="text-sm text-gray-600">{selectedTicket?.subject}</p>
              </div>
              {selectedTicket && getStatusBadge(selectedTicket.status)}
            </div>
          </DialogHeader>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 max-h-[400px]">
            {selectedTicket?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderType === 'member' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderType === 'member'
                      ? 'bg-blue-600 text-white'
                      : message.senderType === 'ai'
                      ? 'bg-purple-100 text-purple-900'
                      : 'bg-green-100 text-green-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.senderType === 'ai' && <Bot className="size-4" />}
                    {message.senderType === 'member' && <UserIcon className="size-4" />}
                    {message.senderType === 'secretary' && <UserCog className="size-4" />}
                    <span className="text-xs font-medium">{message.senderName}</span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* AI Error Notice */}
          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">AI System Temporarily Unavailable</p>
                  <p>Our support team has been notified and will respond to you shortly.</p>
                </div>
              </div>
            </div>
          )}

          {/* Escalate Option */}
          {showEscalateOption && !aiError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-yellow-800">
                  Need more help? Escalate to our support team.
                </div>
                <Button size="sm" variant="outline" onClick={handleEscalate}>
                  <UserCog className="size-4 mr-1" />
                  Escalate to Support
                </Button>
              </div>
            </div>
          )}

          {/* Message Input */}
          {selectedTicket?.status !== 'Closed' && (
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={2}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                <Send className="size-4" />
              </Button>
            </div>
          )}

          <DialogFooter>
            {selectedTicket?.status !== 'Closed' && (
              <Button variant="outline" onClick={handleCloseTicket}>
                <CheckCircle className="size-4 mr-2" />
                Close Ticket
              </Button>
            )}
            <Button onClick={() => setIsChatModalOpen(false)}>
              Close Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
