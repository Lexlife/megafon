import { TOGGLE_MENU } from '../actionTypes';

const initialState = {
  isMobile: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_MENU: {
      const { isMobile } = action.payload;

      return {
        ...initialState,
        isMobile: !state.isMobile,
      };
    }
    default:
      return state;
  }
}
