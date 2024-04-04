import { UserActionTypes } from '../../redux/user/UserTypes';

export const setCurrentUser = (user) => ({
    type: UserActionTypes.SET_CURRENT_USER,
    payload: user,
    });
    