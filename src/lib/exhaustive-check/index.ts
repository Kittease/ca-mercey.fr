const exhaustiveSwitchCheck = (type: never): never => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Unhandled exhaustive switch with value: ${type}`);
};

export default exhaustiveSwitchCheck;
