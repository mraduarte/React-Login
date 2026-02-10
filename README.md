Aplicação de login desenvolvida com **React** e **TypeScript**, utilizando **Firebase** para autenticação com verificação de email e autenticação em duas etapas (2FA).

## 🚀 Funcionalidades

- ✅ Cadastro de novos usuários com confirmação por email
- ✅ Login com autenticação em duas etapas (código enviado por email)
- ✅ Logout de usuários autenticados
- ✅ Proteção de rotas para páginas restritas (Dashboard)
- ✅ Exibição de alertas e feedback visual (Spinner)
- ✅ Estrutura modular com componentes reutilizáveis
- ✅ Página pública acessível sem autenticação

## 🔐 Fluxo de Autenticação

### Cadastro
1. Usuário preenche email e senha
2. Conta é criada no Firebase
3. Email de verificação é enviado automaticamente
4. Usuário deve confirmar o email antes de fazer login

### Login
1. Usuário informa email e senha
2. Sistema verifica se o email foi confirmado
3. Código de 6 dígitos é enviado para o email do usuário
4. Usuário digita o código para finalizar o login
5. Acesso ao Dashboard é liberado

## 🛠️ Tecnologias

- [React](https://reactjs.org/) - Biblioteca para interfaces
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Firebase Auth](https://firebase.google.com/docs/auth) - Autenticação
- [Firebase Firestore](https://firebase.google.com/docs/firestore) - Banco de dados
- [Chakra UI](https://chakra-ui.com/) - Componentes de UI
- [React Router](https://reactrouter.com/) - Navegação
- [EmailJS](https://www.emailjs.com/) - Envio de emails

## ⚙️ Configuração

### 1. Instalar dependências

``````bash
npm install
``````

### 2. Configurar variáveis de ambiente

Crie um arquivo ``.env`` na raiz do projeto:

``````env
REACT_APP_FIREBASE_API_KEY="sua_api_key"
REACT_APP_FIREBASE_AUTH_DOMAIN="seu_projeto.firebaseapp.com"
REACT_APP_FIREBASE_PROJECT_ID="seu_projeto"
REACT_APP_FIREBASE_STORAGE_BUCKET="seu_projeto.appspot.com"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="seu_sender_id"
REACT_APP_FIREBASE_APP_ID="seu_app_id"

# EmailJS
REACT_APP_EMAILJS_SERVICE_ID="seu_service_id"
REACT_APP_EMAILJS_TEMPLATE_ID="seu_template_id"
REACT_APP_EMAILJS_PUBLIC_KEY="sua_public_key"
``````

### 3. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Authentication** com Email/Password
3. Ative o **Firestore Database**
4. Configure as regras do Firestore:

``````javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /loginCodes/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
``````

### 4. Configurar EmailJS

1. Crie uma conta em [emailjs.com](https://www.emailjs.com/)
2. Configure um serviço de email (Gmail, Outlook, etc.)
3. Crie um template com as variáveis ``{{to_email}}`` e ``{{verification_code}}``
4. Copie os IDs para o arquivo ``.env``

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| ``npm start`` | Inicia o servidor de desenvolvimento |
| ``npm run build`` | Gera build de produção |

## 🚀 Executar o Projeto

``````bash
npm start
``````

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 📝 Licença

Este projeto é para fins de estudo.
