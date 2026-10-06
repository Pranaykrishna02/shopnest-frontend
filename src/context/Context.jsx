import {
    createContext,
    useContext,
    useState
} from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token") || ""
    );

    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const isLoggedIn = Boolean(token);

    const login = (newToken, user) => {
        localStorage.setItem("token", newToken);

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        setToken(newToken);
        setCurrentUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken("");
        setCurrentUser(null);
    };

    return (
        <AppContext.Provider
            value={{
                token,
                currentUser,
                isLoggedIn,
                login,
                logout
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}