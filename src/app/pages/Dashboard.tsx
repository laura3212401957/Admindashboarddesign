import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { mockOrders, mockDishes, mockDailyStats } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Dashboard() {
  const todaySales = mockDailyStats[mockDailyStats.length - 1].sales;
  const activeOrders = mockOrders.filter(o => o.status !== 'delivered').length;
  const topDish = mockDishes[0];
  const lowStock = 3;

  const salesData = mockDailyStats.map((stat, index) => ({
    id: `day-${index}`,
    date: new Date(stat.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    ventas: stat.sales,
    pedidos: stat.orders
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Vista general del restaurante</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Ventas del Día
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">${todaySales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              +12.5% respecto a ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Pedidos Activos
            </CardTitle>
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              {mockOrders.filter(o => o.status === 'pending').length} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Plato Top
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold truncate">{topDish.name}</div>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              145 ventas esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Stock Bajo
            </CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{lowStock}</div>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              Requieren reposición
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas de la Semana</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="ventas" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Día</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="pedidos" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{order.id} - {order.tableId}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.items.length} plato(s) • {order.waiterName}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-left sm:text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.paymentMethod}</p>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'ready' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'delivered' ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                    {order.status === 'pending' && 'Pendiente'}
                    {order.status === 'preparing' && 'Preparando'}
                    {order.status === 'ready' && 'Listo'}
                    {order.status === 'delivered' && 'Entregado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
