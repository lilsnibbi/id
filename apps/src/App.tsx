import { Route, Routes } from "react-router";
import NotFound from "./routes/NotFound";

export default function App() {
	return (
		<Routes>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
