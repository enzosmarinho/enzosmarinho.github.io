import {createRoot} from 'react-dom/client';
import BrandStudy from './app/marca/page';
import './app/globals.css';
const root=document.getElementById('enzo-root');
if(root)createRoot(root).render(<BrandStudy portfolioHref="./index.html"/>);
