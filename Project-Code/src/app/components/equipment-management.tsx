import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Package,
  X,
  Save,
  Calendar,
  MapPin,
  Settings
} from 'lucide-react';
import { MockDatabase, Equipment, MaintenanceLog } from '../services/database';

export function EquipmentManagement() {
  const db = MockDatabase.getInstance();
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [allMaintenanceLogs, setAllMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [filterStatus, setFilterStatus] = useState<'All' | Equipment['status']>('All');
  const [filterCategory, setFilterCategory] = useState<'All' | Equipment['category']>('All');
  const [showCreateEquipment, setShowCreateEquipment] = useState(false);
  const [showEditEquipment, setShowEditEquipment] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [activeTab, setActiveTab] = useState('equipment');

  // Equipment form state
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    category: 'Cardio' as Equipment['category'],
    manufacturer: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchaseCost: 0,
    location: '',
    status: 'Operational' as Equipment['status'],
    condition: 'Excellent' as Equipment['condition'],
    maintenanceInterval: 90,
    notes: ''
  });

  // Maintenance log form state
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: 'Scheduled' as MaintenanceLog['type'],
    priority: 'Medium' as MaintenanceLog['priority'],
    scheduledDate: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [filterStatus, filterCategory]);

  const loadData = () => {
    let equipment = db.getAllEquipment();

    if (filterStatus !== 'All') {
      equipment = equipment.filter(e => e.status === filterStatus);
    }

    if (filterCategory !== 'All') {
      equipment = equipment.filter(e => e.category === filterCategory);
    }

    setAllEquipment(equipment);
    setAllMaintenanceLogs(db.getAllMaintenanceLogs());
  };

  const stats = db.getEquipmentStats();
  const maintenanceStats = db.getMaintenanceStats(30);

  const handleCreateEquipment = () => {
    if (!equipmentForm.name || !equipmentForm.serialNumber) {
      alert('Please fill in required fields');
      return;
    }

    const nextMaintDate = new Date(equipmentForm.purchaseDate || Date.now());
    nextMaintDate.setDate(nextMaintDate.getDate() + equipmentForm.maintenanceInterval);

    db.createEquipment({
      ...equipmentForm,
      nextMaintenanceDate: nextMaintDate.toISOString().split('T')[0]
    });

    // Reset form
    setEquipmentForm({
      name: '',
      category: 'Cardio',
      manufacturer: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      purchaseCost: 0,
      location: '',
      status: 'Operational',
      condition: 'Excellent',
      maintenanceInterval: 90,
      notes: ''
    });

    setShowCreateEquipment(false);
    loadData();
  };

  const handleUpdateEquipment = () => {
    if (!selectedEquipment) return;

    db.updateEquipment(selectedEquipment.id, equipmentForm);
    setShowEditEquipment(false);
    setSelectedEquipment(null);
    loadData();
  };

  const handleDeleteEquipment = (id: string) => {
    if (confirm('Are you sure you want to delete this equipment? All associated maintenance logs will remain.')) {
      db.deleteEquipment(id);
      loadData();
    }
  };

  const handleScheduleMaintenance = () => {
    if (!selectedEquipment || !maintenanceForm.scheduledDate) {
      alert('Please fill in required fields');
      return;
    }

    db.createMaintenanceLog({
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      type: maintenanceForm.type,
      status: 'Scheduled',
      priority: maintenanceForm.priority,
      scheduledDate: maintenanceForm.scheduledDate,
      description: maintenanceForm.description,
      notes: maintenanceForm.notes
    });

    // Reset form
    setMaintenanceForm({
      type: 'Scheduled',
      priority: 'Medium',
      scheduledDate: '',
      description: '',
      notes: ''
    });

    setShowMaintenanceModal(false);
    loadData();
  };

  const openEditEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setEquipmentForm({
      name: equipment.name,
      category: equipment.category,
      manufacturer: equipment.manufacturer,
      model: equipment.model,
      serialNumber: equipment.serialNumber,
      purchaseDate: equipment.purchaseDate,
      purchaseCost: equipment.purchaseCost,
      location: equipment.location,
      status: equipment.status,
      condition: equipment.condition,
      maintenanceInterval: equipment.maintenanceInterval,
      notes: equipment.notes || ''
    });
    setShowEditEquipment(true);
  };

  const openScheduleMaintenance = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowMaintenanceModal(true);
  };

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-100 text-green-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Service':
        return 'bg-red-100 text-red-800';
      case 'Retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  const getMaintenanceStatusColor = (status: MaintenanceLog['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: MaintenanceLog['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-6">
          {/* Equipment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Equipment</CardTitle>
                <Package className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stats.total}</div>
                <p className="text-xs text-gray-500 mt-1">All equipment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Operational</CardTitle>
                <CheckCircle className="size-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stats.operational}</div>
                <p className="text-xs text-gray-500 mt-1">Ready to use</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Under Maintenance</CardTitle>
                <Wrench className="size-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stats.underMaintenance}</div>
                <p className="text-xs text-gray-500 mt-1">In service</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Needs Maintenance</CardTitle>
                <AlertTriangle className="size-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stats.needingMaintenance}</div>
                <p className="text-xs text-gray-500 mt-1">Overdue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Value</CardTitle>
                <DollarSign className="size-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">${Math.round(stats.totalValue).toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Investment</p>
              </CardContent>
            </Card>
          </div>

          {/* Equipment List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Equipment Inventory</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Manage all gym equipment</p>
                </div>
                <Button onClick={() => setShowCreateEquipment(true)}>
                  <Plus className="size-4 mr-2" />
                  Add Equipment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label>Status:</Label>
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="Out of Service">Out of Service</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label>Category:</Label>
                  <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Free Weights">Free Weights</SelectItem>
                      <SelectItem value="Functional">Functional</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Equipment Cards */}
              <div className="space-y-3">
                {allEquipment.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="size-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No equipment found</p>
                    <p className="text-sm text-gray-400">Add your first piece of equipment</p>
                  </div>
                ) : (
                  allEquipment.map(equipment => (
                    <div key={equipment.id} className="p-4 border rounded-lg hover:border-blue-400 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{equipment.name}</h3>
                            <Badge className={getStatusColor(equipment.status)}>{equipment.status}</Badge>
                            <Badge variant="outline">{equipment.category}</Badge>
                            <Badge variant="outline">{equipment.condition}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                            <div>
                              <span className="text-gray-500">Manufacturer:</span> {equipment.manufacturer}
                            </div>
                            <div>
                              <span className="text-gray-500">Model:</span> {equipment.model}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="size-4" />
                              {equipment.location}
                            </div>
                            <div>
                              <span className="text-gray-500">Purchased:</span> {equipment.purchaseDate}
                            </div>
                          </div>
                          {equipment.nextMaintenanceDate && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="size-4 text-gray-400" />
                              <span className="text-gray-600">
                                Next Maintenance: <span className="font-medium">{equipment.nextMaintenanceDate}</span>
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openScheduleMaintenance(equipment)}
                          >
                            <Wrench className="size-4 mr-1" />
                            Schedule
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditEquipment(equipment)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEquipment(equipment.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          {/* Maintenance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Logs</CardTitle>
                <Settings className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{maintenanceStats.total}</div>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Scheduled</CardTitle>
                <Clock className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{maintenanceStats.scheduled}</div>
                <p className="text-xs text-gray-500 mt-1">Upcoming</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Overdue</CardTitle>
                <AlertTriangle className="size-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{maintenanceStats.overdue}</div>
                <p className="text-xs text-gray-500 mt-1">Needs attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Cost (30d)</CardTitle>
                <DollarSign className="size-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">${Math.round(maintenanceStats.totalCost).toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Avg Downtime</CardTitle>
                <TrendingUp className="size-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{maintenanceStats.averageDowntime.toFixed(1)}h</div>
                <p className="text-xs text-gray-500 mt-1">Per incident</p>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Logs</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Track all maintenance activities</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allMaintenanceLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Wrench className="size-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No maintenance logs</p>
                  </div>
                ) : (
                  allMaintenanceLogs.slice(0, 10).map(log => (
                    <div key={log.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{log.equipmentName}</h4>
                            <Badge className={getMaintenanceStatusColor(log.status)}>{log.status}</Badge>
                            <Badge className={getPriorityColor(log.priority)}>{log.priority}</Badge>
                            <Badge variant="outline">{log.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="text-gray-400">Scheduled:</span> {log.scheduledDate}
                            </div>
                            {log.completedDate && (
                              <div>
                                <span className="text-gray-400">Completed:</span> {log.completedDate}
                              </div>
                            )}
                            {log.performedBy && (
                              <div>
                                <span className="text-gray-400">Performed By:</span> {log.performedBy}
                              </div>
                            )}
                            {log.totalCost && (
                              <div>
                                <span className="text-gray-400">Cost:</span> ${log.totalCost}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Charts and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Equipment by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.byCategory).map(([category, count]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipment Condition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.byCondition).map(([condition, count]) => (
                    <div key={condition}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{condition}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(maintenanceStats.byType).map(([type, count]) => (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{type}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-600"
                          style={{ width: `${(count / maintenanceStats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Average Equipment Age</span>
                  <span className="font-medium">{stats.averageAge} days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Avg Maintenance Cost</span>
                  <span className="font-medium">${Math.round(maintenanceStats.averageCost)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Completed Maintenance</span>
                  <span className="font-medium">{maintenanceStats.completed}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-medium">{maintenanceStats.inProgress}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Equipment Modal */}
      {showCreateEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add New Equipment</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateEquipment(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Equipment Name *</Label>
                  <Input
                    value={equipmentForm.name}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                    placeholder="e.g., Treadmill Pro X1"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={equipmentForm.category} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, category: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Free Weights">Free Weights</SelectItem>
                      <SelectItem value="Functional">Functional</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Manufacturer</Label>
                  <Input
                    value={equipmentForm.manufacturer}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, manufacturer: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Model</Label>
                  <Input
                    value={equipmentForm.model}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, model: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Serial Number *</Label>
                  <Input
                    value={equipmentForm.serialNumber}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, serialNumber: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={equipmentForm.location}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, location: e.target.value })}
                    placeholder="e.g., Main Floor - Cardio Zone"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Purchase Date</Label>
                  <Input
                    type="date"
                    value={equipmentForm.purchaseDate}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, purchaseDate: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Purchase Cost ($)</Label>
                  <Input
                    type="number"
                    value={equipmentForm.purchaseCost}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, purchaseCost: parseFloat(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={equipmentForm.status} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, status: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="Out of Service">Out of Service</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select value={equipmentForm.condition} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, condition: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Maintenance Interval (days)</Label>
                  <Input
                    type="number"
                    value={equipmentForm.maintenanceInterval}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, maintenanceInterval: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={equipmentForm.notes}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, notes: e.target.value })}
                  placeholder="Additional notes..."
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateEquipment(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateEquipment}>
                  <Save className="size-4 mr-2" />
                  Add Equipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {showEditEquipment && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Equipment</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowEditEquipment(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Same form as create, but with update button */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Equipment Name *</Label>
                  <Input
                    value={equipmentForm.name}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={equipmentForm.category} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, category: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Free Weights">Free Weights</SelectItem>
                      <SelectItem value="Functional">Functional</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={equipmentForm.status} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, status: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="Out of Service">Out of Service</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select value={equipmentForm.condition} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, condition: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={equipmentForm.location}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, location: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={equipmentForm.notes}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, notes: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowEditEquipment(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleUpdateEquipment}>
                  <Save className="size-4 mr-2" />
                  Update Equipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Maintenance Modal */}
      {showMaintenanceModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Schedule Maintenance</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{selectedEquipment.name}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowMaintenanceModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={maintenanceForm.type} onValueChange={(value: any) => setMaintenanceForm({ ...maintenanceForm, type: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={maintenanceForm.priority} onValueChange={(value: any) => setMaintenanceForm({ ...maintenanceForm, priority: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Scheduled Date</Label>
                <Input
                  type="date"
                  value={maintenanceForm.scheduledDate}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, scheduledDate: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                  placeholder="Describe the maintenance work..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={maintenanceForm.notes}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                  placeholder="Additional notes..."
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowMaintenanceModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleScheduleMaintenance}>
                  <Save className="size-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
