import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "./router/index.jsx";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { restoreUser } from "./redux/slices/authSlice";
import { getUser, isAuthenticated, clearTokens } from "./utils/auth.utils";
import { ErrorBoundary } from './components/common/ErrorBoundary';


//Hello World
//testing
function App() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const user = getUser();
    const hasToken = isAuthenticated();
    
    if (hasToken) {
      dispatch(restoreUser());
    } else if (user) {
      clearTokens();
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <div className="h-full">
        <Toaster position="top-center" />
        <AppRouter />
      </div>
    </ErrorBoundary>
  );
}

export default App;