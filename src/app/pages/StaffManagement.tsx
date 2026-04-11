import { useState } from 'react';
import { mockWaiters, Waiter } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { Plus, UserCircle, MapPin } from 'lucide-react';

const allTables = [
  'Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6',
  'Mesa 7', 'Mesa 8', 'Mesa 9', 'Mesa 10', 'Mesa 11', 'Mesa 12'
];

export function StaffManagement() {
  const [waiters, setWaiters] = useState<Waiter[]>(mockWaiters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWaiter, setEditingWaiter] = useState<Waiter | null>(null);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);

  const activeWaiters = waiters.filter(w => w.status === 'active');
  const assignedTables = waiters.flatMap(w => w.assignedTables);
  const unassignedTables = allTables.filter(t => !assignedTables.includes(t));

  const handleSaveWaiter = (waiter: Waiter) => {
    if (editingWaiter) {
      setWaiters(waiters.map(w => w.id === waiter.id ? waiter : w));
    } else {
      const newWaiter = { ...waiter, id: `W${waiters.length + 1}` };
      setWaiters([...waiters, newWaiter]);
    }
    setIsDialogOpen(false);
    setEditingWaiter(null);
  };

  const toggleWaiterStatus = (id: string) => {
    setWaiters(waiters.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: w.status === 'active' ? 'inactive' : 'active',
          assignedTables: w.status === 'active' ? [] : w.assignedTables
        };
      }
      return w;
    }));
  };

  const handleDragStart = (table: string, fromWaiterId?: string) => {
    setDraggedTable(table);
  };

  const handleDrop = (waiterId: string) => {
    if (!draggedTable) return;

    setWaiters(waiters.map(w => {
      if (w.assignedTables.includes(draggedTable)) {
        return { ...w, assignedTables: w.assignedTables.filter(t => t !== draggedTable) };
      }
      return w;
    }).map(w => {
      if (w.id === waiterId && w.status === 'active' && !w.assignedTables.includes(draggedTable)) {
        return { ...w, assignedTables: [...w.assignedTables, draggedTable] };
      }
      return w;
    }));

    setDraggedTable(null);
  };

  const handleDropUnassigned = () => {
    if (!draggedTable) return;

    setWaiters(waiters.map(w => ({
      ...w,
      assignedTables: w.assignedTables.filter(t => t !== draggedTable)
    })));

    setDraggedTable(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl">Gestión de Personal</h1>
          <p className="text-sm md:text-base text-muted-foreground">Administra meseros y asignación de mesas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingWaiter(null)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Mesero
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <WaiterForm
              waiter={editingWaiter}
              onSave={handleSaveWaiter}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingWaiter(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeWaiters.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Meseros activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{waiters.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de personal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{assignedTables.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Mesas asignadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{unassignedTables.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Mesas sin asignar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Waiters List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Meseros</h2>
          {waiters.map((waiter) => (
            <Card
              key={waiter.id}
              className={`transition-colors ${
                waiter.status === 'inactive' ? 'opacity-60' : ''
              }`}
              onDragOver={(e) => {
                if (waiter.status === 'active') {
                  e.preventDefault();
                }
              }}
              onDrop={() => handleDrop(waiter.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{waiter.name}</h3>
                      <Badge
                        variant={waiter.status === 'active' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {waiter.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={waiter.status === 'active'}
                      onCheckedChange={() => toggleWaiterStatus(waiter.id)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Mesas asignadas ({waiter.assignedTables.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {waiter.assignedTables.length > 0 ? (
                      waiter.assignedTables.map((table) => (
                        <div
                          key={table}
                          draggable
                          onDragStart={() => handleDragStart(table, waiter.id)}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm cursor-move hover:opacity-80 transition-opacity"
                        >
                          {table}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Sin mesas asignadas</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Unassigned Tables */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Mesas Disponibles</h2>
          <Card
            className="min-h-96"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropUnassigned}
          >
            <CardHeader>
              <CardTitle className="text-base">Arrastra para asignar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {unassignedTables.length > 0 ? (
                  unassignedTables.map((table) => (
                    <div
                      key={table}
                      draggable
                      onDragStart={() => handleDragStart(table)}
                      className="px-3 py-1.5 bg-muted text-foreground rounded-md text-sm cursor-move hover:bg-muted/80 transition-colors"
                    >
                      {table}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Todas las mesas están asignadas</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Instrucciones
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Arrastra las mesas para asignarlas a los meseros</li>
                <li>• Arrastra de vuelta para desasignar</li>
                <li>• Los meseros inactivos no pueden recibir mesas</li>
                <li>• Al desactivar un mesero, sus mesas se liberan automáticamente</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WaiterForm({ waiter, onSave, onCancel }: { waiter: Waiter | null; onSave: (waiter: Waiter) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Waiter>(
    waiter || {
      id: '',
      name: '',
      status: 'active',
      assignedTables: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{waiter ? 'Editar Mesero' : 'Agregar Nuevo Mesero'}</DialogTitle>
        <DialogDescription>
          Completa los datos del mesero
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Juan Pérez"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={formData.status === 'active'}
            onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
          />
          <Label htmlFor="status">Activo</Label>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {waiter ? 'Guardar Cambios' : 'Agregar Mesero'}
          </Button>
        </div>
      </form>
    </>
  );
}
