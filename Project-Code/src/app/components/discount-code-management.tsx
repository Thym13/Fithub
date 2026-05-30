import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Tag,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { MockDatabase, DiscountCode, DiscountCodeUsage } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function DiscountCodeManagement() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<DiscountCode[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'Percentage' as const,
    discountValue: 0,
    applicableTo: 'All Memberships' as const,
    specificMembership: '',
    minPurchaseAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    usagePerUser: 0,
    validFrom: '',
    validUntil: '',
    status: 'Active' as const
  });

  // Load discount codes
  useEffect(() => {
    loadDiscountCodes();
  }, []);

  // Filter codes when filter changes
  useEffect(() => {
    if (filterStatus === 'All') {
      setFilteredCodes(discountCodes);
    } else {
      setFilteredCodes(discountCodes.filter(c => c.status === filterStatus));
    }
  }, [filterStatus, discountCodes]);

  const loadDiscountCodes = () => {
    const codes = db.getAllDiscountCodes();
    setDiscountCodes(codes);
  };

  const handleCreate = () => {
    if (!user) return;

    db.createDiscountCode({
      ...formData,
      code: formData.code.toUpperCase(),
      createdBy: user.id,
      createdByName: user.name
    });

    loadDiscountCodes();
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedCode) return;

    db.updateDiscountCode(selectedCode.id, formData);

    loadDiscountCodes();
    setShowEditModal(false);
    setSelectedCode(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedCode) return;

    db.deleteDiscountCode(selectedCode.id);

    loadDiscountCodes();
    setShowDeleteModal(false);
    setSelectedCode(null);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'Percentage',
      discountValue: 0,
      applicableTo: 'All Memberships',
      specificMembership: '',
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      usagePerUser: 0,
      validFrom: '',
      validUntil: '',
      status: 'Active'
    });
  };

  const openEditModal = (code: DiscountCode) => {
    setSelectedCode(code);
    setFormData({
      code: code.code,
      name: code.name,
      description: code.description,
      discountType: code.discountType,
      discountValue: code.discountValue,
      applicableTo: code.applicableTo,
      specificMembership: code.specificMembership || '',
      minPurchaseAmount: code.minPurchaseAmount || 0,
      maxDiscountAmount: code.maxDiscountAmount || 0,
      usageLimit: code.usageLimit || 0,
      usagePerUser: code.usagePerUser || 0,
      validFrom: code.validFrom.split('T')[0],
      validUntil: code.validUntil.split('T')[0],
      status: code.status
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDiscountTypeColor = (type: string) => {
    switch (type) {
      case 'Percentage': return 'bg-purple-100 text-purple-800';
      case 'Fixed Amount': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const stats = {
    total: discountCodes.length,
    active: discountCodes.filter(c => c.status === 'Active').length,
    expired: discountCodes.filter(c => c.status === 'Expired').length,
    totalUsage: discountCodes.reduce((sum, c) => sum + c.usageCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tag className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Codes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Codes</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="size-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expired Codes</p>
                <p className="text-2xl font-bold">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Discount Codes</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="size-4 mr-2" />
                Create Code
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCodes.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="size-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Discount Codes</h3>
              <p className="text-gray-600 mb-4">Create your first discount code to get started</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="size-4 mr-2" />
                Create Code
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCodes.map((code) => (
                <Card key={code.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-lg">{code.name}</h3>
                          </div>
                          <Badge variant="outline" className="font-mono text-sm">
                            {code.code}
                          </Badge>
                        </div>
                        <Badge className={getStatusColor(code.status)}>
                          {code.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {code.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Discount:</span>
                          <Badge className={getDiscountTypeColor(code.discountType)}>
                            {code.discountType === 'Percentage'
                              ? `${code.discountValue}%`
                              : `€${code.discountValue}`}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Applies To:</span>
                          <span className="font-medium text-xs">{code.applicableTo}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Usage:</span>
                          <span className="font-medium">
                            {code.usageCount}/{code.usageLimit || '∞'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Valid Until:</span>
                          <span className="font-medium text-xs">
                            {new Date(code.validUntil).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedCode(code);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="size-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(code)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCode(code);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{showCreateModal ? 'Create Discount Code' : 'Edit Discount Code'}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  showCreateModal ? setShowCreateModal(false) : setShowEditModal(false);
                  resetForm();
                  setSelectedCode(null);
                }}
              >
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Code * (uppercase letters/numbers)</Label>
                  <Input
                    placeholder="SUMMER50"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Display Name *</Label>
                  <Input
                    placeholder="Summer Special"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  placeholder="Describe the discount offer..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Type *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(val: 'Percentage' | 'Fixed Amount') => setFormData({ ...formData, discountType: val })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage (%)</SelectItem>
                      <SelectItem value="Fixed Amount">Fixed Amount (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Discount Value *</Label>
                  <Input
                    type="number"
                    placeholder={formData.discountType === 'Percentage' ? '20' : '50'}
                    value={formData.discountValue || ''}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Applies To *</Label>
                  <Select
                    value={formData.applicableTo}
                    onValueChange={(val: any) => setFormData({ ...formData, applicableTo: val })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Memberships">All Memberships</SelectItem>
                      <SelectItem value="Premium Only">Premium Only</SelectItem>
                      <SelectItem value="Basic Only">Basic Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.discountType === 'Percentage' && (
                  <div>
                    <Label>Max Discount Amount (€)</Label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={formData.maxDiscountAmount || ''}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Purchase Amount (€)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.minPurchaseAmount || ''}
                    onChange={(e) => setFormData({ ...formData, minPurchaseAmount: Number(e.target.value) })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Usage Limit (0 = unlimited)</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.usageLimit || ''}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Usage Per User (0 = unlimited)</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={formData.usagePerUser || ''}
                    onChange={(e) => setFormData({ ...formData, usagePerUser: Number(e.target.value) })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Disabled">Disabled</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valid From *</Label>
                  <Input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Valid Until *</Label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    showCreateModal ? setShowCreateModal(false) : setShowEditModal(false);
                    resetForm();
                    setSelectedCode(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={showCreateModal ? handleCreate : handleEdit}
                  disabled={!formData.code || !formData.name || !formData.description || !formData.validFrom || !formData.validUntil}
                  className="flex-1"
                >
                  {showCreateModal ? 'Create Code' : 'Update Code'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Discount Code Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowViewModal(false);
                setSelectedCode(null);
              }}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Code</Label>
                  <p className="font-medium font-mono text-lg">{selectedCode.code}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <Badge className={getStatusColor(selectedCode.status)}>
                    {selectedCode.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Name</Label>
                <p className="font-medium">{selectedCode.name}</p>
              </div>

              <div>
                <Label className="text-gray-600">Description</Label>
                <p className="text-sm">{selectedCode.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Discount Type</Label>
                  <Badge className={getDiscountTypeColor(selectedCode.discountType)}>
                    {selectedCode.discountType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-600">Discount Value</Label>
                  <p className="font-medium">
                    {selectedCode.discountType === 'Percentage'
                      ? `${selectedCode.discountValue}%`
                      : `€${selectedCode.discountValue}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Applies To</Label>
                  <p className="text-sm">{selectedCode.applicableTo}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Usage</Label>
                  <p className="font-medium">
                    {selectedCode.usageCount} / {selectedCode.usageLimit || '∞'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Valid From</Label>
                  <p className="text-sm">{new Date(selectedCode.validFrom).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Valid Until</Label>
                  <p className="text-sm">{new Date(selectedCode.validUntil).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedCode.minPurchaseAmount && (
                <div>
                  <Label className="text-gray-600">Minimum Purchase</Label>
                  <p className="font-medium">€{selectedCode.minPurchaseAmount}</p>
                </div>
              )}

              {selectedCode.maxDiscountAmount && (
                <div>
                  <Label className="text-gray-600">Maximum Discount</Label>
                  <p className="font-medium">€{selectedCode.maxDiscountAmount}</p>
                </div>
              )}

              <div>
                <Label className="text-gray-600">Created By</Label>
                <p className="text-sm">{selectedCode.createdByName} on {new Date(selectedCode.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="size-5 text-red-600" />
                Delete Discount Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Are you sure you want to delete the discount code <strong>{selectedCode.code}</strong>?</p>
              <p className="text-sm text-gray-600">This action cannot be undone. Members will no longer be able to use this code.</p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCode(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  Delete Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
