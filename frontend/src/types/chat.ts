export interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
}