const exhaustiveSwitchCheck = (type: never): never => {
  throw new Error(`Unhandled exhaustive switch with value: ${type}`);
};

export default exhaustiveSwitchCheck;
