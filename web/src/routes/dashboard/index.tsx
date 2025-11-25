import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangleIcon, CloudIcon, CloudRainIcon, DownloadIcon, DropletsIcon, MapPinIcon, SunIcon, ThermometerIcon, TrendingUpIcon, WindIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const currentData = {
    temperature: 24,
    humidity: 68,
    windSpeed: 12,
    condition: "Parcialmente Nublado",
    location: "Orocó, SP",
  };

  const historicalData = [
    { date: "2024-01-15 14:00", location: currentData.location, condition: "Ensolarado", temp: 28, humidity: 55 },
    { date: "2024-01-15 13:00", location: currentData.location, condition: "Parcialmente Nublado", temp: 26, humidity: 60 },
    { date: "2024-01-15 12:00", location: currentData.location, condition: "Nublado", temp: 24, humidity: 65 },
    { date: "2024-01-15 11:00", location: currentData.location, condition: "Chuvoso", temp: 22, humidity: 75 },
    { date: "2024-01-15 10:00", location: currentData.location, condition: "Chuvoso", temp: 21, humidity: 78 },
    { date: "2024-01-15 09:00", location: currentData.location, condition: "Nublado", temp: 20, humidity: 72 },
  ];

  const temperatureChartData = [
    { time: "09:00", temperatura: 20 },
    { time: "10:00", temperatura: 21 },
    { time: "11:00", temperatura: 22 },
    { time: "12:00", temperatura: 24 },
    { time: "13:00", temperatura: 26 },
    { time: "14:00", temperatura: 28 },
    { time: "15:00", temperatura: 27 },
    { time: "16:00", temperatura: 25 },
  ];

  const rainProbabilityData = [
    { time: "Agora", probabilidade: 15 },
    { time: "+1h", probabilidade: 25 },
    { time: "+2h", probabilidade: 45 },
    { time: "+3h", probabilidade: 65 },
    { time: "+4h", probabilidade: 80 },
    { time: "+5h", probabilidade: 70 },
    { time: "+6h", probabilidade: 50 },
  ];

  const aiInsights = [
    {
      title: "Tendência Climática",
      description: "A temperatura está em queda gradual. Esperado clima mais fresco nas próximas 3 horas com aumento de umidade.",
      value: "-6°C",
      icon: TrendingUpIcon,
      color: "text-primary",
    },
    {
      title: "Alerta de Umidade",
      description: "Alta umidade detectada. Recomenda-se atenção para possível formação de neblina ou chuva leve.",
      value: "68%",
      icon: AlertTriangleIcon,
      color: "text-yellow-500",
    },
    {
      title: "Previsão IA",
      description: "Probabilidade de chuva aumenta nas próximas 4 horas (80%). Após esse período, condições melhorando gradualmente.",
      value: "Chuva → Sol",
      icon: CloudRainIcon,
      color: "text-primary",
    },
    {
      title: "Clima Agradável",
      description: "Apesar da umidade, a temperatura está em nível confortável. Ideal para atividades em ambientes cobertos.",
      value: "24°C",
      icon: SunIcon,
      color: "text-primary",
    },
  ];

  const handleExport = (format: string) => {
    toast.success(`Exportando dados em formato ${format.toUpperCase()}...`);
  };

  return (
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard de Clima</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="h-4 w-4" />
              <p>{currentData.location}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("xlsx")}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              XLSX
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Temperatura</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <ThermometerIcon className="h-6 w-6 text-primary" />
                {currentData.temperature}°C
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Umidade</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <DropletsIcon className="h-6 w-6 text-primary" />
                {currentData.humidity}%
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Vento</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <WindIcon className="h-6 w-6 text-primary" />
                {currentData.windSpeed} km/h
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Condição</CardDescription>
              <CardTitle className="text-xl flex items-center gap-2">
                <CloudIcon className="h-6 w-6 text-primary" />
                {currentData.condition}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Registros</CardTitle>
            <CardDescription>Últimas medições registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Data/Hora</th>
                    <th className="text-left py-3 px-4">Local</th>
                    <th className="text-left py-3 px-4">Condição</th>
                    <th className="text-left py-3 px-4">Temperatura</th>
                    <th className="text-left py-3 px-4">Umidade</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData.map((record, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">{record.date}</td>
                      <td className="py-3 px-4 text-sm">{record.location}</td>
                      <td className="py-3 px-4 text-sm">{record.condition}</td>
                      <td className="py-3 px-4 text-sm">{record.temp}°C</td>
                      <td className="py-3 px-4 text-sm">{record.humidity}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Temperatura ao Longo do Tempo</CardTitle>
              <CardDescription>Variação da temperatura nas últimas horas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temperatureChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperatura" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Temperatura (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Probabilidade de Chuva</CardTitle>
              <CardDescription>Previsão para as próximas horas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rainProbabilityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="probabilidade" 
                    fill="hsl(var(--primary))" 
                    name="Probabilidade (%)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Insights de IA</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-lg ${insight.color}`}>
                      <Icon className="h-5 w-5" />
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
  );
}
