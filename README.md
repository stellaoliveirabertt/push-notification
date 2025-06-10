# Gerador de Token FCM

Uma aplicação web para gerar tokens Firebase Cloud Messaging (FCM) para teste de backend.

## 🚀 Funcionalidades

- ✅ Interface intuitiva para configuração do Firebase
- ✅ Geração de tokens FCM em tempo real
- ✅ Verificação de suporte do navegador
- ✅ Solicitação automática de permissões de notificação
- ✅ Exibição de mensagens FCM recebidas
- ✅ Cópia fácil do token para área de transferência
- ✅ Design responsivo e moderno

## 📋 Pré-requisitos

1. **Projeto Firebase configurado**
   - Acesse o [Console do Firebase](https://console.firebase.google.com/)
   - Crie um novo projeto ou use um existente
   - Ative o Firebase Cloud Messaging

2. **Configurações necessárias**
   - API Key
   - Auth Domain
   - Project ID
   - Messaging Sender ID
   - App ID
   - VAPID Key (obtida em Project Settings → Cloud Messaging)

## 🛠️ Como usar

### 1. Configuração inicial

1. **Configure o Firebase**:
   - Clique em "Mostrar Configurações"
   - Preencha todos os campos com suas credenciais do Firebase
   - A VAPID Key pode ser encontrada no Console do Firebase em:
     `Project Settings → Cloud Messaging → Web configuration`

2. **Atualize o Service Worker** (opcional):
   - Edite o arquivo `public/firebase-messaging-sw.js`
   - Substitua as configurações padrão pelas suas

### 2. Gerando o token

1. Certifique-se de que o navegador suporta notificações
2. Permita notificações quando solicitado
3. Clique em "Gerar Token FCM"
4. Copie o token gerado

### 3. Usando o token no backend

Use o token gerado para enviar notificações push do seu backend:

```javascript
// Exemplo usando Firebase Admin SDK (Node.js)
const admin = require('firebase-admin');

const message = {
  notification: {
    title: 'Título da notificação',
    body: 'Conteúdo da mensagem'
  },
  token: 'SEU_TOKEN_FCM_AQUI'
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Mensagem enviada com sucesso:', response);
  })
  .catch((error) => {
    console.log('Erro ao enviar mensagem:', error);
  });
```

## 🔧 Desenvolvimento

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd fcm-token-generator

# Instale as dependências
pnpm install
```

### Executando localmente

```bash
# Inicie o servidor de desenvolvimento
pnpm run dev

# Ou com acesso externo
pnpm run dev --host
```

### Build para produção

```bash
# Gere os arquivos de produção
pnpm run build

# Visualize o build localmente
pnpm run preview
```

## 📁 Estrutura do projeto

```
fcm-token-generator/
├── public/
│   └── firebase-messaging-sw.js    # Service Worker do Firebase
├── src/
│   ├── components/ui/              # Componentes UI (shadcn/ui)
│   ├── firebase-config.js          # Configurações do Firebase
│   ├── App.jsx                     # Componente principal
│   ├── App.css                     # Estilos globais
│   └── main.jsx                    # Ponto de entrada
├── index.html                      # HTML principal
└── package.json                    # Dependências e scripts
```

## 🔒 Segurança

- **Nunca** exponha suas credenciais do Firebase em repositórios públicos
- Use variáveis de ambiente para configurações sensíveis em produção
- O token FCM é específico para cada dispositivo/navegador
- Tokens podem expirar e precisam ser regenerados periodicamente

## 🌐 Tecnologias utilizadas

- **React 19** - Framework frontend
- **Vite** - Build tool e dev server
- **Firebase SDK** - Integração com FCM
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## 📝 Notas importantes

1. **Permissões**: O usuário deve permitir notificações no navegador
2. **HTTPS**: Em produção, a aplicação deve ser servida via HTTPS
3. **Service Worker**: Necessário para receber mensagens em background
4. **Compatibilidade**: Funciona em navegadores modernos que suportam Push API

## 🐛 Solução de problemas

### Token não é gerado
- Verifique se todas as configurações do Firebase estão corretas
- Certifique-se de que as permissões de notificação foram concedidas
- Verifique o console do navegador para erros

### Mensagens não são recebidas
- Confirme que o service worker está registrado corretamente
- Verifique se o token está sendo usado corretamente no backend
- Teste com uma ferramenta como Postman ou curl

### Erro de configuração
- Verifique se a VAPID Key está correta
- Confirme que o projeto Firebase tem FCM habilitado
- Certifique-se de que o domínio está autorizado no Firebase

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação oficial do [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
2. Consulte os logs do console do navegador
3. Teste com configurações mínimas primeiro

