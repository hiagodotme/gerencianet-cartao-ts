# Gerencianet Cartão SDK

SDK criada para facilitar a obtenção do payment_token exigido nas API's de cartão da Gerencianet.

## Instalando a biblioteca

Instale utilizando o NPM ou então copie o arquivo disponível em `./lib`.

```npm
npm install gerencianet-cartao-ts
```

## Identificador da conta
Para utilizar a biblioteca é necessário obter o identificador de sua conta.

Atualmente na versão 7.0 a informação encontra-se no menu *API*. Ao entrar na tela, procure pelo botão "Identificador de conta". Uma modal será aberta e a informação será exibida.

## Recuperando payee_code
A biblioteca pode ser utilizada em qualquer framework que utilize o typescript ou o javascript no browser.

> Exemplo de uso da SDK

```ts
import { GerencianetCartao } from 'gerencianet-cartao-ts';

class MinhaClasse {

    async recuperaPaymentToken() {
        const payee_code = 'identificador da sua conta';
        const is_producao = false;
        const sdkGn = await GerencianetCartao.instance(payee_code, is_producao);
        const retorno = await sdkGn.getPaymentToken();

        return retorno.payment_token;
    }
}
```

# Licença
[MIT](https://mit-license.org/)