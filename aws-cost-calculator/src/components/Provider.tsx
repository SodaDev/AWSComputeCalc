import {Action} from "../state/actions";
import {reducer} from "../state/reducer";
import {AppContext, initialState} from "../state/context";
import {State} from "../State";
import {useReducer} from "react";

export default function Provider(props: React.PropsWithChildren<{}>) {
    const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState)
    return <AppContext.Provider value={{ state, dispatch }} {...props} />
}
