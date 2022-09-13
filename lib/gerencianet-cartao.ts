/* eslint-disable prefer-arrow/prefer-arrow-functions */
export class GerencianetCartao {
  private static _instance: GerencianetCartao;

  private constructor(
    private readonly _identificador_conta: string,
    private readonly _is_producao: boolean
  ) {}

  static async instance(
    _identificador_conta: string,
    _is_producao = true
  ): Promise<GerencianetCartao> {
    if (!this._instance) {
      const gnSdk = new GerencianetCartao(_identificador_conta, _is_producao);
      await gnSdk._init();
      this._instance = gnSdk;
    }
    return this._instance;
  }

  async getPaymentToken(
    cartao: IGnCartaoCredito
  ): Promise<{ card_mask: string; payment_token: string }> {
    return new Promise((resolve, reject) => {
      window["$gn"].ready((checkout: any) => {
        checkout.getPaymentToken(cartao, (error: any, response: any) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(response.data);
          }
        });
      });
    });
  }

  async getInstallments(
    it_valor: number,
    vc_bandeira: string
  ): Promise<{
    installments: {
      currency: string;
      has_interest: boolean;
      installment: number;
      interest_percentage: number;
      value: number;
    }[];
    name: string;
    rate: number;
  }> {
    return new Promise((resolve, reject) => {
      window["$gn"].ready((checkout: any) => {
        checkout.getInstallments(it_valor, vc_bandeira, (error: any, response: any) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(response.data);
          }
        });
      });
    });
  }

  private _init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!!document.getElementById(this._identificador_conta)) {
        resolve(true);
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = (): void => resolve(true);
      script.onerror = (): void => {
        reject(true);
        document.getElementById(this._identificador_conta)?.remove();
      };

      const ambiente_gn = this._is_producao ? "api" : "sandbox";
      const v = Math.ceil(Math.random() * 1000000);
      script.src = `https://${ambiente_gn}.gerencianet.com.br/v1/cdn/${this._identificador_conta}/${v}`;

      script.async = false;
      script.id = this._identificador_conta;

      if (!document.getElementById(this._identificador_conta)) {
        document.getElementsByTagName("head")[0].appendChild(script);
      }

      window["$gn"] = {
        validForm: true,
        processed: false,
        done: {},
        ready: function (fn: any): void {
          window["$gn"].done = fn;
        },
      };
    });
  }
}

export interface IGnCartaoCredito {
  brand: string; // bandeira do cartão
  ["number"]: string; // número do cartão
  cvv: string; // código de segurança
  expiration_month: string; // mês de vencimento
  expiration_year: string; // ano de vencimento
}
