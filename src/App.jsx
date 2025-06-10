import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Copy, CheckCircle, AlertCircle, Settings, MessageSquare } from 'lucide-react';
import { firebaseConfig, vapidKey } from './firebase-config.js';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([]);
  const [config, setConfig] = useState(firebaseConfig);
  const [vapid, setVapid] = useState(vapidKey);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    // Verifica se o navegador suporta notificações
    setIsSupported('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window);
    setPermission(Notification.permission);
  }, []);

  const updateConfig = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      setError('Erro ao solicitar permissão para notificações');
      return false;
    }
  };

  const generateToken = async () => {
    if (!isSupported) {
      setError('Seu navegador não suporta notificações push');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Solicita permissão se necessário
      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setError('Permissão para notificações negada');
          setLoading(false);
          return;
        }
      }

      // Inicializa o Firebase com a configuração atual
      const app = initializeApp(config);
      const messaging = getMessaging(app);

      // Registra o service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registrado:', registration);

      // Gera o token
      const currentToken = await getToken(messaging, {
        vapidKey: vapid,
        serviceWorkerRegistration: registration
      });

      if (currentToken) {
        setToken(currentToken);
        console.log('Token FCM gerado:', currentToken);

        // Configura listener para mensagens em foreground
        onMessage(messaging, (payload) => {
          console.log('Mensagem recebida em foreground:', payload);
          setMessages(prev => [...prev, {
            id: Date.now(),
            title: payload.notification?.title || 'Sem título',
            body: payload.notification?.body || 'Sem conteúdo',
            data: payload.data,
            timestamp: new Date().toLocaleString()
          }]);
        });

      } else {
        setError('Não foi possível gerar o token. Verifique as configurações do Firebase.');
      }
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      setError(`Erro ao gerar token: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar token:', error);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gerador de Token FCM
          </h1>
          <p className="text-lg text-gray-600">
            Ferramenta para gerar tokens Firebase Cloud Messaging para teste de backend
          </p>
        </div>

        {/* Configuração do Firebase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuração do Firebase
            </CardTitle>
            <CardDescription>
              Configure suas credenciais do Firebase antes de gerar o token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => setShowConfig(!showConfig)}
              className="mb-4"
            >
              {showConfig ? 'Ocultar' : 'Mostrar'} Configurações
            </Button>
            
            {showConfig && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    value={config.apiKey}
                    onChange={(e) => updateConfig('apiKey', e.target.value)}
                    placeholder="Sua API Key do Firebase"
                  />
                </div>
                <div>
                  <Label htmlFor="authDomain">Auth Domain</Label>
                  <Input
                    id="authDomain"
                    value={config.authDomain}
                    onChange={(e) => updateConfig('authDomain', e.target.value)}
                    placeholder="seu-projeto.firebaseapp.com"
                  />
                </div>
                <div>
                  <Label htmlFor="projectId">Project ID</Label>
                  <Input
                    id="projectId"
                    value={config.projectId}
                    onChange={(e) => updateConfig('projectId', e.target.value)}
                    placeholder="seu-projeto-id"
                  />
                </div>
                <div>
                  <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
                  <Input
                    id="messagingSenderId"
                    value={config.messagingSenderId}
                    onChange={(e) => updateConfig('messagingSenderId', e.target.value)}
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="appId">App ID</Label>
                  <Input
                    id="appId"
                    value={config.appId}
                    onChange={(e) => updateConfig('appId', e.target.value)}
                    placeholder="1:123456789:web:abcdef123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="vapidKey">VAPID Key</Label>
                  <Input
                    id="vapidKey"
                    value={vapid}
                    onChange={(e) => setVapid(e.target.value)}
                    placeholder="Sua VAPID Key"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status do Navegador */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Navegador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isSupported ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span>
                  Suporte a notificações: {isSupported ? 'Suportado' : 'Não suportado'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {permission === 'granted' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <span>
                  Permissão para notificações: {permission === 'granted' ? 'Concedida' : 'Não concedida'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geração do Token */}
        <Card>
          <CardHeader>
            <CardTitle>Gerar Token FCM</CardTitle>
            <CardDescription>
              Clique no botão abaixo para gerar um token FCM para seu dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateToken} 
              disabled={loading || !isSupported}
              className="w-full"
              size="lg"
            >
              {loading ? 'Gerando...' : 'Gerar Token FCM'}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {token && (
              <div className="space-y-2">
                <Label htmlFor="token">Token FCM Gerado:</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="token"
                    value={token}
                    readOnly
                    className="min-h-[100px] font-mono text-sm"
                  />
                  <Button
                    onClick={copyToken}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600">Token copiado para a área de transferência!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mensagens Recebidas */}
        {messages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Mensagens Recebidas ({messages.length})
              </CardTitle>
              <CardDescription>
                Mensagens FCM recebidas em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={clearMessages} variant="outline" size="sm">
                  Limpar Mensagens
                </Button>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="p-3 border rounded-lg bg-gray-50">
                      <div className="font-semibold">{message.title}</div>
                      <div className="text-sm text-gray-600">{message.body}</div>
                      <div className="text-xs text-gray-400 mt-1">{message.timestamp}</div>
                      {message.data && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer">Dados adicionais</summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(message.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle>Como usar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>Configure suas credenciais do Firebase na seção "Configuração do Firebase"</li>
                <li>Certifique-se de que as permissões de notificação estão habilitadas</li>
                <li>Clique em "Gerar Token FCM" para obter seu token</li>
                <li>Copie o token gerado e use-o em seu backend para enviar notificações</li>
                <li>As mensagens recebidas aparecerão na seção "Mensagens Recebidas"</li>
              </ol>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Importante:</h4>
                <ul className="list-disc list-inside text-blue-800 text-sm mt-2 space-y-1">
                  <li>Substitua as configurações padrão pelas suas próprias configurações do Firebase</li>
                  <li>Obtenha a VAPID Key no Console do Firebase em Project Settings → Cloud Messaging</li>
                  <li>Este token é único para este dispositivo e navegador</li>
                  <li>O token pode expirar e precisar ser regenerado periodicamente</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;

