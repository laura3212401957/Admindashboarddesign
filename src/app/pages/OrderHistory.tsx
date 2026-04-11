import { useState } from 'react';
import { mockOrders, Order } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Calendar, Search, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export function OrderHistory() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tableId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.waiterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrder = totalRevenue / orders.length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl">Historial de Pedidos</h1>
        <p className="text-sm md:text-base text-muted-foreground">Consulta todos los pedidos realizados</p>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de pedidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Ingresos totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${averageOrder.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Promedio por pedido</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, mesa o mesero..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="preparing">En preparación</SelectItem>
                <SelectItem value="ready">Listo</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Mesa</TableHead>
                <TableHead>Mesero</TableHead>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.tableId}</TableCell>
                  <TableCell>{order.waiterName}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.createdAt.toLocaleDateString('es-ES')}</div>
                      <div className="text-muted-foreground">
                        {order.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {order.status === 'pending' && 'Pendiente'}
                      {order.status === 'preparing' && 'Preparando'}
                      {order.status === 'ready' && 'Listo'}
                      {order.status === 'delivered' && 'Entregado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron pedidos
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Detalle del Pedido {selectedOrder.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mesa</p>
                    <p className="font-medium">{selectedOrder.tableId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mesero</p>
                    <p className="font-medium">{selectedOrder.waiterName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha/Hora</p>
                    <p className="font-medium">
                      {selectedOrder.createdAt.toLocaleString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pago</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Platos</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-muted/50 rounded">
                        <span>{item.quantity}x {item.dishName}</span>
                        <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.customerNotes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notas del cliente</p>
                    <p className="p-2 bg-muted/50 rounded text-sm">{selectedOrder.customerNotes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
