declare module "pino" {
  interface LoggerOptions {
    level?: string;
    transport?: {
      target: string;
      options?: Record<string, unknown>;
    };
    base?: Record<string, unknown>;
    [key: string]: unknown;
  }

  interface Logger {
    info(obj: object, msg?: string): void;
    warn(obj: object, msg?: string): void;
    error(obj: object, msg?: string): void;
    debug(obj: object, msg?: string): void;
    fatal(obj: object, msg?: string): void;
    trace(obj: object, msg?: string): void;
    child(bindings: Record<string, unknown>): Logger;
    level: string;
  }

  function pino(options?: LoggerOptions): Logger;
  export = pino;
}
