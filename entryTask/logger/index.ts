type logFuncSig = (...args: any) => void;

interface ICtx {
  log: logFuncSig;
  info: logFuncSig;
  warn: logFuncSig;
  error: logFuncSig;
  assert: logFuncSig;
}

const logger: ICtx = {
  log: (...args: any) => {
    console.log(...args);
  },
  info: (...args: any) => {
    console.info(...args);
  },
  warn: (...args: any) => {
    console.warn(...args);
  },
  error: (...args: any) => {
    console.error(...args);
  },
  assert: (...args: any) => {
    console.error('[ASSERT]', ...args);
  },
};

export default logger;
