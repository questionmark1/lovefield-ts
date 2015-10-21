export class Exception implements Error {
  public code: number;
  public name: string;
  public message: string;
  constructor(code: number, ...args: any[]) {
    this.code = code;
    this.message = 'http://sn.im/2a0j3wn?c=' + code.toString();

    if (args.length > 0) {
      // Allow at most 4 parameters, each parameter at most 64 chars.
      for (var i = 0; i < Math.min(4, args.length - 1); ++i) {
        this.message += '&p' + (i - 1) + '=' +
            encodeURIComponent(args[i].toString().slice(0, 64));
      }
    }
  }
}
