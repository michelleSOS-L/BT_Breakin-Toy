import './App.css';
import HeaderComponent from './components/headerComponent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ToDoComponentTbl from './components/ToDoComponentTbl'; 
import ToDoComponent from './components/ToDoComponent'; 

function App() {
  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          <Route path='/' element={<ToDoComponentTbl />} />
          <Route path='/ToDos' element={<ToDoComponentTbl />} />
          <Route path='/add-ToDo' element={<ToDoComponent onClose={function (): void {
            throw new Error('Function not implemented.');
          } } onSaved={function (): void {
            throw new Error('Function not implemented.');
          } } />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;