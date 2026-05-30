import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
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
  Eye,
  Filter,
  AlertTriangle,
  UserCog,
  User as UserIcon,
  Bot,
  Clock,
  Ticket as TicketIcon
} from 'lucide-react';
import { MockDatabase, SupportTicket } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function SupportTicketManagement() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    loadTickets();
  }, [filterStatus]);

  const loadTickets = () => {
    let allTickets = db.getAllSupportTickets();

    if (filterStatus !== 'All') {
      allTickets = db.getSupportTicketsByStatus(filterStatus as any);
    }

    // Sort by created date (newest first)
    allTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setTickets(allTickets);
  };

  const handleOpenChat = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsChatModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!selectedTicket || !user || !messageInput.trim()) return;

    // Add secretary message
    db.addMessageToTicket(selectedTicket.id, {
      senderId: user.id,
      senderName: user.name,
      senderType: 'secretary',
      message: messageInput.trim(),
    });

    setMessageInput('');

    // Refresh ticket
    const refreshed = db.getSupportTicketById(selectedTicket.id);
    if (refreshed) {
      setSelectedTicket(refreshed);
    }

    loadTickets();
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;

    db.closeTicket(selectedTicket.id, 'secretary');
    setIsChatModalOpen(false);
    loadTickets();
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

  // Calculate statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    aiResponding: tickets.filter(t => t.status === 'AI Responding').length,
    escalated: tickets.filter(t => t.status === 'Escalated').length,
    closed: tickets.filter(t => t.status === 'Closed').length,
    withErrors: tickets.filter(t => t.aiErrorOccurred).length,
  };

  const filteredTickets = filterStatus === 'All' ? tickets : tickets.filter(t => t.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
              <TicketIcon className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Responding</p>
                <p className="text-2xl font-bold">{stats.aiResponding}</p>
              </div>
              <Bot className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Escalated</p>
                <p className="text-2xl font-bold">{stats.escalated}</p>
              </div>
              <UserCog className="size-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Errors</p>
                <p className="text-2xl font-bold">{stats.withErrors}</p>
              </div>
              <AlertTriangle className="size-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Support Tickets</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-gray-600" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Tickets</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="AI Responding">AI Responding</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No tickets found with the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">#{ticket.ticketNumber}</h3>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                        {ticket.aiErrorOccurred && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="size-3 mr-1" />
                            AI Error
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Category: {ticket.category}</span>
                        <span className="flex items-center gap-1">
                          <UserIcon className="size-3" />
                          {ticket.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        <span>{ticket.messages.length} messages</span>
                      </div>
                      {ticket.assignedToName && (
                        <p className="text-sm text-gray-600 mt-1">
                          Assigned to: {ticket.assignedToName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenChat(ticket)}
                    >
                      <Eye className="size-4 mr-1" />
                      View & Respond
                    </Button>

                    {ticket.status !== 'Closed' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          handleOpenChat(ticket);
                        }}
                      >
                        <Send className="size-4 mr-1" />
                        Respond
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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

          {/* Ticket Info */}
          {selectedTicket && (
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Member:</span> {selectedTicket.userName}
                </div>
                <div>
                  <span className="text-gray-600">Email:</span> {selectedTicket.userEmail}
                </div>
                <div>
                  <span className="text-gray-600">Category:</span> {selectedTicket.category}
                </div>
                <div>
                  <span className="text-gray-600">Priority:</span> {selectedTicket.priority}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Description:</span> {selectedTicket.description}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 max-h-[400px]">
            {selectedTicket?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderType === 'secretary' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderType === 'secretary'
                      ? 'bg-green-600 text-white'
                      : message.senderType === 'member'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-purple-100 text-purple-900'
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
          </div>

          {/* AI Error Notice */}
          {selectedTicket?.aiErrorOccurred && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">AI System Error Occurred</p>
                  <p>The AI assistant failed to respond. Manual intervention required.</p>
                </div>
              </div>
            </div>
          )}

          {/* Message Input */}
          {selectedTicket?.status !== 'Closed' && (
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your response to the member..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
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
