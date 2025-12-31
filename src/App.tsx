import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateToken from './pages/CreateToken';
import MyTokens from './pages/MyTokens';
import TokenDetail from './pages/TokenDetail';
import Deploy from './pages/Deploy';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="create" element={<CreateToken />} />
        <Route path="my-tokens" element={<MyTokens />} />
        <Route path="token/:address" element={<TokenDetail />} />
        <Route path="deploy" element={<Deploy />} />
      </Route>
    </Routes>
  );
}
