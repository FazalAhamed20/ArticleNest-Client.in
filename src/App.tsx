import { Suspense } from "react";
import RouteConfig from "./router/routeConfig";
import LoadingSpinner from "./utils/modal/loadSpinnerModal";


function App() {
  return (
    <>
    <Suspense fallback={<LoadingSpinner />}>
      <RouteConfig />
    </Suspense>
  
    </>
  );
}

export default App;
