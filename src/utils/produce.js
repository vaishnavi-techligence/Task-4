// A robust, standard state-drafting utility produce() that creates a deep clone of baseState and allows recipes to mutate the draft directly.
export function produce(baseState, recipe) {
  if (baseState === null || baseState === undefined) return baseState;
  const draft = structuredClone(baseState);
  const result = recipe(draft);
  return result !== undefined ? result : draft;
}

