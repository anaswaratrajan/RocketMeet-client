import { MailerPollArgs, MailerEventArgs } from "../models/poll";

interface MailerResponse {
  statusCode: number;
}

class MailerAPI {
  // senderID: string;
  headers: any;

  URL: string | undefined;

  mailer_domain: string | undefined;

  origin_domain: string | undefined;

  version: string | undefined;

  constructor() {
    // this.senderID = "userIDfromStore"
    // this.token = "tokenfromStore"

    this.origin_domain = process.env.NEXT_PUBLIC_ORIGIN_DOMAIN;
    this.mailer_domain = process.env.NEXT_PUBLIC_MAILER_DOMAIN;
    this.version = process.env.NEXT_PUBLIC_VERSION_NUMBER;
    this.URL = `${this.mailer_domain}/v${this.version}`;
  }

  httpPost = async (
    payload: string,
    endpoint: string,
    token: string
  ): Promise<MailerResponse> => {
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const requestOptions: RequestInit = {
      mode: "cors",
      credentials: "include",
      method: "POST",
      headers: this.headers,
      body: payload,
    };
    const res = await fetch(endpoint, requestOptions);
    const { status } = res;
    return {
      statusCode: status,
    };
  };

  sendPollInvites = (
    // Invite pollers
    mailerArgs: MailerPollArgs,
    token: string
  ): Promise<MailerResponse> => {
    const payload = JSON.stringify(mailerArgs);
    const endpoint = `${this.URL}/meetInfo`;
    return this.httpPost(payload, endpoint, token);
  };

  sendEventInvites = (
    // Invite pollers for the event in final time-slot
    mailerArgs: MailerEventArgs,
    token: string
  ): Promise<MailerResponse> => {
    const payload = JSON.stringify(mailerArgs);
    const endpoint = `${this.URL}/finalOption`;
    return this.httpPost(payload, endpoint, token);
  };
}

export const mailerAPI = new MailerAPI();
