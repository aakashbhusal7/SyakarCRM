import React from 'react';

const TokenContext = React.createContext();

const TokenProvider = (props) => {
    const [token, setToken] = React.useState();
    const[isLogin,setIsLogin]=React.useState(false);

    return (
        <TokenContext.Provider
            value={{
                token,
                setToken,
                isLogin,
                setIsLogin
            }}
        >
            {props.children}
        </TokenContext.Provider>
    )

}
export { TokenProvider, TokenContext };
