import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  X,
  Send,
  Clock,
  CheckCircle,
  Eye,
  Users,
  Mail,
  TrendingUp,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import { MockDatabase, Campaign, User as UserType } from '../services/database';
import { authService } from '../services/auth';
import { emailService } from '../services/email';

export function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Email' as Campaign['type'],
    targetAudience: 'All Members' as Campaign['targetAudience'],
    subject: '',
    message: '',
    scheduledDate: '',
    status: 'Draft' as Campaign['status']
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    setLoading(true);
    const db = MockDatabase.getInstance();
    const allCampaigns = db.getAllCampaigns();
    setCampaigns(allCampaigns);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'Email',
      targetAudience: 'All Members',
      subject: '',
      message: '',
      scheduledDate: '',
      status: 'Draft'
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    const db = MockDatabase.getInstance();
    const newCampaign = db.createCampaign({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      targetAudience: formData.targetAudience,
      subject: formData.subject,
      message: formData.message,
      scheduledDate: formData.scheduledDate || undefined,
      status: formData.status,
      createdBy: currentUser.id,
      createdByName: currentUser.name
    });

    // Calculate target count
    const targetMembers = db.getTargetMembers(newCampaign);
    db.updateCampaign(newCampaign.id, {
      analytics: {
        ...newCampaign.analytics,
        targetCount: targetMembers.length
      }
    });

    loadCampaigns();
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedCampaign) return;
    if (!formData.name || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    const db = MockDatabase.getInstance();
    const updatedCampaign = db.updateCampaign(selectedCampaign.id, {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      targetAudience: formData.targetAudience,
      subject: formData.subject,
      message: formData.message,
      scheduledDate: formData.scheduledDate || undefined,
      status: formData.status
    });

    if (updatedCampaign) {
      // Recalculate target count if audience changed
      const targetMembers = db.getTargetMembers(updatedCampaign);
      db.updateCampaign(updatedCampaign.id, {
        analytics: {
          ...updatedCampaign.analytics,
          targetCount: targetMembers.length
        }
      });
    }

    loadCampaigns();
    setShowEditModal(false);
    setSelectedCampaign(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedCampaign) return;

    const db = MockDatabase.getInstance();
    db.deleteCampaign(selectedCampaign.id);

    loadCampaigns();
    setShowDeleteModal(false);
    setSelectedCampaign(null);
  };

  const handleSendNow = (campaign: Campaign) => {
    const db = MockDatabase.getInstance();
    const targetMembers = db.getTargetMembers(campaign);

    // Send emails to all target members
    targetMembers.forEach(member => {
      emailService.sendEmail({
        to: member.email,
        subject: campaign.subject,
        body: campaign.message
      });
    });

    // Update campaign status and analytics
    db.updateCampaign(campaign.id, {
      status: 'Sent',
      sentAt: new Date().toISOString(),
      analytics: {
        targetCount: targetMembers.length,
        sentCount: targetMembers.length,
        deliveredCount: targetMembers.length,
        openedCount: 0,
        clickedCount: 0
      }
    });

    loadCampaigns();
    alert(`Campaign sent to ${targetMembers.length} members!`);
  };

  const openEditModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      targetAudience: campaign.targetAudience,
      subject: campaign.subject,
      message: campaign.message,
      scheduledDate: campaign.scheduledDate || '',
      status: campaign.status
    });
    setShowEditModal(true);
  };

  const openViewModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowViewModal(true);
  };

  const openAnalyticsModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowAnalyticsModal(true);
  };

  const openDeleteModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Sent': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Email': 'bg-purple-100 text-purple-800',
      'SMS': 'bg-orange-100 text-orange-800',
      'Push Notification': 'bg-blue-100 text-blue-800',
      'In-App': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filterStatus !== 'All' && campaign.status !== filterStatus) return false;
    return true;
  });

  const campaignStats = {
    total: campaigns.length,
    draft: campaigns.filter(c => c.status === 'Draft').length,
    scheduled: campaigns.filter(c => c.status === 'Scheduled').length,
    sent: campaigns.filter(c => c.status === 'Sent').length,
    totalSent: campaigns.reduce((sum, c) => sum + c.analytics.sentCount, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Campaigns</CardTitle>
              <Megaphone className="size-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{campaignStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Draft</CardTitle>
              <Edit className="size-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{campaignStats.draft}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Scheduled</CardTitle>
              <Clock className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{campaignStats.scheduled}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Sent</CardTitle>
              <CheckCircle className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{campaignStats.sent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Emails Sent</CardTitle>
              <Mail className="size-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{campaignStats.totalSent}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Create Button */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>Marketing Campaigns</CardTitle>
              <Button onClick={() => { resetForm(); setShowCreateModal(true); }}>
                <Plus className="size-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label>Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Campaigns List */}
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <Megaphone className="size-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Campaigns Found</h3>
                <p className="text-gray-500 mb-4">
                  {filterStatus !== 'All'
                    ? 'No campaigns match your filters.'
                    : 'Create your first marketing campaign to reach your members.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCampaigns.map(campaign => (
                  <div
                    key={campaign.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium">{campaign.name}</h3>
                              <Badge variant="outline" className={getStatusColor(campaign.status)}>
                                {campaign.status}
                              </Badge>
                              <Badge variant="outline" className={getTypeColor(campaign.type)}>
                                {campaign.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{campaign.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <div className="text-gray-500">Target Audience</div>
                            <div className="font-medium flex items-center gap-1">
                              <Users className="size-3" />
                              {campaign.targetAudience}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Recipients</div>
                            <div className="font-medium">{campaign.analytics.targetCount}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Created By</div>
                            <div className="font-medium">{campaign.createdByName}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Created On</div>
                            <div className="font-medium">
                              {new Date(campaign.createdAt).toLocaleDateString('en-GB')}
                            </div>
                          </div>
                        </div>

                        {campaign.status === 'Sent' && (
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="size-4" />
                              Sent: {campaign.analytics.sentCount}
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                              <Mail className="size-4" />
                              Opened: {campaign.analytics.openedCount}
                            </div>
                            <div className="flex items-center gap-1 text-purple-600">
                              <TrendingUp className="size-4" />
                              Clicked: {campaign.analytics.clickedCount}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {campaign.status === 'Sent' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAnalyticsModal(campaign)}
                          >
                            <BarChart3 className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewModal(campaign)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        {campaign.status === 'Draft' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(campaign)}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendNow(campaign)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Send className="size-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteModal(campaign)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create New Campaign</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Campaign Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Summer Promotion 2026"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the campaign..."
                  className="mt-2"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Campaign Type *</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as Campaign['type'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Push Notification">Push Notification</SelectItem>
                      <SelectItem value="In-App">In-App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Target Audience *</Label>
                  <Select value={formData.targetAudience} onValueChange={(val) => setFormData({ ...formData, targetAudience: val as Campaign['targetAudience'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Members">All Members</SelectItem>
                      <SelectItem value="Premium Members">Premium Members</SelectItem>
                      <SelectItem value="Basic Members">Basic Members</SelectItem>
                      <SelectItem value="Inactive Members">Inactive Members</SelectItem>
                      <SelectItem value="New Members">New Members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Email Subject *</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Special Offer - 20% Off!"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Email Message *</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your campaign message here..."
                  className="mt-2"
                  rows={8}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Schedule Date (Optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as Campaign['status'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="flex-1">
                  <CheckCircle className="size-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {showEditModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Campaign</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Campaign Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Campaign Type *</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as Campaign['type'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Push Notification">Push Notification</SelectItem>
                      <SelectItem value="In-App">In-App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Target Audience *</Label>
                  <Select value={formData.targetAudience} onValueChange={(val) => setFormData({ ...formData, targetAudience: val as Campaign['targetAudience'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Members">All Members</SelectItem>
                      <SelectItem value="Premium Members">Premium Members</SelectItem>
                      <SelectItem value="Basic Members">Basic Members</SelectItem>
                      <SelectItem value="Inactive Members">Inactive Members</SelectItem>
                      <SelectItem value="New Members">New Members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Email Subject *</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Email Message *</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-2"
                  rows={8}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleEdit} className="flex-1">
                  <CheckCircle className="size-4 mr-2" />
                  Update Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Campaign Modal */}
      {showViewModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campaign Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowViewModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-500">Campaign Name</Label>
                <p className="font-medium">{selectedCampaign.name}</p>
              </div>

              {selectedCampaign.description && (
                <div>
                  <Label className="text-gray-500">Description</Label>
                  <p className="text-sm text-gray-700">{selectedCampaign.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Type</Label>
                  <Badge variant="outline" className={getTypeColor(selectedCampaign.type) + ' mt-1'}>
                    {selectedCampaign.type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <Badge variant="outline" className={getStatusColor(selectedCampaign.status) + ' mt-1'}>
                    {selectedCampaign.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-gray-500">Target Audience</Label>
                <p className="font-medium">{selectedCampaign.targetAudience}</p>
              </div>

              <div>
                <Label className="text-gray-500">Subject</Label>
                <p className="font-medium">{selectedCampaign.subject}</p>
              </div>

              <div>
                <Label className="text-gray-500">Message</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm">
                  <div dangerouslySetInnerHTML={{ __html: selectedCampaign.message }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Created By</Label>
                  <p className="font-medium">{selectedCampaign.createdByName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Created On</Label>
                  <p className="font-medium">{new Date(selectedCampaign.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {selectedCampaign.sentAt && (
                <div>
                  <Label className="text-gray-500">Sent On</Label>
                  <p className="font-medium">{new Date(selectedCampaign.sentAt).toLocaleString('en-GB')}</p>
                </div>
              )}

              <Button onClick={() => setShowViewModal(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campaign Analytics</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAnalyticsModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">{selectedCampaign.name}</h3>
                <p className="text-sm text-gray-600">Sent on {new Date(selectedCampaign.sentAt || '').toLocaleString('en-GB')}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Target Recipients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCampaign.analytics.targetCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Sent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{selectedCampaign.analytics.sentCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Delivered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCampaign.analytics.deliveredCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Opened</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{selectedCampaign.analytics.openedCount}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedCampaign.analytics.deliveredCount > 0
                        ? Math.round((selectedCampaign.analytics.openedCount / selectedCampaign.analytics.deliveredCount) * 100)
                        : 0}% open rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Clicked</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{selectedCampaign.analytics.clickedCount}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedCampaign.analytics.openedCount > 0
                        ? Math.round((selectedCampaign.analytics.clickedCount / selectedCampaign.analytics.openedCount) * 100)
                        : 0}% CTR
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Delivery Rate</Label>
                    <span className="text-sm font-medium">
                      {selectedCampaign.analytics.sentCount > 0
                        ? Math.round((selectedCampaign.analytics.deliveredCount / selectedCampaign.analytics.sentCount) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress
                    value={selectedCampaign.analytics.sentCount > 0
                      ? (selectedCampaign.analytics.deliveredCount / selectedCampaign.analytics.sentCount) * 100
                      : 0}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Open Rate</Label>
                    <span className="text-sm font-medium">
                      {selectedCampaign.analytics.deliveredCount > 0
                        ? Math.round((selectedCampaign.analytics.openedCount / selectedCampaign.analytics.deliveredCount) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress
                    value={selectedCampaign.analytics.deliveredCount > 0
                      ? (selectedCampaign.analytics.openedCount / selectedCampaign.analytics.deliveredCount) * 100
                      : 0}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Click-through Rate</Label>
                    <span className="text-sm font-medium">
                      {selectedCampaign.analytics.openedCount > 0
                        ? Math.round((selectedCampaign.analytics.clickedCount / selectedCampaign.analytics.openedCount) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress
                    value={selectedCampaign.analytics.openedCount > 0
                      ? (selectedCampaign.analytics.clickedCount / selectedCampaign.analytics.openedCount) * 100
                      : 0}
                    className="h-2"
                  />
                </div>
              </div>

              <Button onClick={() => setShowAnalyticsModal(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Are you sure you want to delete this campaign?</p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedCampaign.name}</p>
                <p className="text-sm text-gray-600 mt-1">Status: {selectedCampaign.status}</p>
              </div>
              <p className="text-sm text-red-600">This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="flex-1">
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
