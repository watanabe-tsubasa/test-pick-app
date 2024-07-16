import { initialTimestamps, Timestamps } from "./components/Picker";

type Action = 
  | { type: 'SET_TIMESTAMP'; action: keyof Timestamps; value: string }
  | { type: 'RESET_TIMESTAMPS'; }

export const timestampReducer = (state: Timestamps, action: Action): Timestamps => {
  switch (action.type) {
    case 'SET_TIMESTAMP':
      return {
        ...state,
        [action.action]: action.value
      };
    case 'RESET_TIMESTAMPS':
      return initialTimestamps
    default:
      return state
  }
}