import { useState } from 'react';
import { mockOrders, Order } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Clock, CreditCard, User, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  preparing: { label: 'En preparación', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  ready: { label: 'Listo', color: 'bg-green-100 text-green-800 border-green-200' },
  delivered: { label: 'Entregado', color: 'bg-gray-100 text-gray-800 border-gray-200' }
};

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  const activeOrders = filteredOrders.filter(o => o.status !== 'delivered');

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl">Pedidos Activos</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gestiona los pedidos en tiempo real</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los pedidos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="preparing">En preparación</SelectItem>
            <SelectItem value="ready">Listos</SelectItem>
            <SelectItem value="delivered">Entregados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'preparing').length}</div>
            <p className="text-xs text-muted-foreground mt-1">En preparación</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'ready').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Listos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Entregados hoy</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeOrders.map((order) => (
          <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedOrder(order)}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{order.tableId}</p>
                </div>
                <Badge className={statusConfig[order.status].color} variant="outline">
                  {statusConfig[order.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.dishName}
                    </span>
                    <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{order.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{order.waiterName}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeOrders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay pedidos activos en este momento
          </CardContent>
        </Card>
      )}

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
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-medium">
                      {selectedOrder.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
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

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Cambiar estado</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                      className="text-xs"
                    >
                      Pendiente
                    </Button>
                    <Button
                      variant={selectedOrder.status === 'preparing' ? 'default' : 'outline'}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                      className="text-xs"
                    >
                      En preparación
                    </Button>
                    <Button
                      variant={selectedOrder.status === 'ready' ? 'default' : 'outline'}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                      className="text-xs"
                    >
                      Listo
                    </Button>
                    <Button
                      variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      className="text-xs"
                    >
                      Entregado
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
