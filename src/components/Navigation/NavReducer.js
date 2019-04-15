const navStateReducer = (state, action) => {
  switch (action.type) {
    case "ADMIN":
      return Object.assign(
        {},
        { ...state },
        { adminToolsAnchorEl: action.payload }
      );
    case "SIDENAVTOGGLE":
      return Object.assign({}, { ...state }, { sideNav: !state.sideNav });
    default:
      return state;
  }
};

const initialNavState = {
  adminToolsAnchorEl: null,
  toolsAnchorEl: null,
  sideNav: false
};

export { navStateReducer, initialNavState };
