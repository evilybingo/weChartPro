import { LOGIN} from '../constants/namespace'

const INITIAL_STATE = {
  res:{}
}

export default function login (state = INITIAL_STATE, action) {
  switch (action.type) {
       case LOGIN:
       return {
         ...state,
         res:action.payload,
       }
     default:
       return state
  }
}
