import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockDailyStats, topDishes, mockDishes } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, BarChart3 } from 'lucide-react';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function Analytics() {
  const salesData = mockDailyStats.map((stat, index) => ({
    id: `stat-${index}`,
    date: new Date(stat.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    ventas: stat.sales,
    pedidos: stat.orders
  }));

  const categoryData = mockDishes.reduce((acc, dish, index) => {
    const existing = acc.find(item => item.name === dish.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ id: `cat-${dish.category}-${acc.length}`, name: dish.category, value: 1 });
    }
    return acc;
  }, [] as { id: string; name: string; value: number }[]);

  const totalSales = mockDailyStats.reduce((sum, stat) => sum + stat.sales, 0);
  const averageSales = totalSales / mockDailyStats.length;
  const weekGrowth = ((mockDailyStats[mockDailyStats.length - 1].sales - mockDailyStats[0].sales) / mockDailyStats[0].sales) * 100;

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl">Estadísticas y Analítica</h1>
        <p className="text-sm md:text-base text-muted-foreground">Métricas y rendimiento del restaurante</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ventas Totales</p>
                <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">{weekGrowth.toFixed(1)}%</span>
              <span className="text-muted-foreground">vs semana anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Promedio Diario</p>
                <div className="text-2xl font-bold">${averageSales.toFixed(2)}</div>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Últimos 7 días</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platos en Menú</p>
                <div className="text-2xl font-bold">{mockDishes.length}</div>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mockDishes.filter(d => d.available).length} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pedidos Totales</p>
                <div className="text-2xl font-bold">
                  {mockDailyStats.reduce((sum, stat) => sum + stat.orders, 0)}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Última semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Día</CardTitle>
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
                <Bar dataKey="pedidos" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Platos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDishes.map((dish, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dish.name}</span>
                    <span className="text-sm text-muted-foreground">{dish.sales} ventas</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex-1 mr-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(dish.sales / topDishes[0].sales) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium">${dish.revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categoría</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.id} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Estimate */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo Estimado de Insumos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Harina', used: 85, total: 100, unit: 'kg' },
              { name: 'Tomates', used: 42, total: 50, unit: 'kg' },
              { name: 'Queso Mozzarella', used: 28, total: 40, unit: 'kg' },
              { name: 'Aceite de Oliva', used: 12, total: 20, unit: 'L' },
              { name: 'Lechuga', used: 15, total: 25, unit: 'unidades' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.used}/{item.total} {item.unit}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (item.used / item.total) > 0.8 ? 'bg-red-500' :
                      (item.used / item.total) > 0.6 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(item.used / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
